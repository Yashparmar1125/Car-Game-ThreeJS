import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Checkpoint({ position, onPass, isActive }) {
  const checkpointRef = useRef()
  const materialRef = useRef()

  useFrame((state) => {
    if (checkpointRef.current && materialRef.current) {
      // Make the checkpoint pulse
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      checkpointRef.current.scale.set(scale, scale, scale)
      
      // Change color based on active state
      materialRef.current.color.setHex(isActive ? 0x00ff00 : 0xff0000)
    }
  })

  return (
    <mesh ref={checkpointRef} position={position}>
      <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
      <meshStandardMaterial 
        ref={materialRef}
        color={isActive ? 0x00ff00 : 0xff0000}
        transparent
        opacity={0.8}
        emissive={isActive ? 0x00ff00 : 0xff0000}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
} 