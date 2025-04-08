import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, AccumulativeShadows, RandomizedLight, Center, OrbitControls, useTexture, Stars, Sky, Cloud, useHelper } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'
import Car from './Car'
import UI from './UI'
import Checkpoint from './Checkpoint'

function RoadSegment({ position, rotation = [0, 0, 0], curve = 0 }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main road base layer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]} receiveShadow>
        <planeGeometry args={[20.4, 20.4]} />
        <meshStandardMaterial 
          color="#333333"
          roughness={0.9}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#444444"
          roughness={0.8}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Road edges */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9.9, -0.49, 0]}>
        <planeGeometry args={[0.2, 20]} />
        <meshStandardMaterial 
          color="#ffffff"
          roughness={0.8}
          metalness={0.1}
          emissive="#ff0000"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9.9, -0.49, 0]}>
        <planeGeometry args={[0.2, 20]} />
        <meshStandardMaterial 
          color="#ffffff"
          roughness={0.8}
          metalness={0.1}
          emissive="#ff0000"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Center line */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh 
          key={i}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.48, i * 2 - 9]}
        >
          <planeGeometry args={[0.15, 1]} />
          <meshStandardMaterial 
            color="#ffffff"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Enhanced barriers */}
      {[-10, 10].map((x) => (
        <group key={x} position={[x, 0, 0]} rotation={[0, x > 0 ? 0 : Math.PI, 0]}>
          {Array.from({ length: 10 }).map((_, i) => (
            <group key={i} position={[0, 0, i * 2 - 10]}>
              {/* Barrier post */}
              <mesh castShadow position={[0, 0.5, 0]}>
                <boxGeometry args={[0.2, 1, 0.2]} />
                <meshStandardMaterial 
                  color="#666666"
                  metalness={0.4}
                  roughness={0.6}
                />
              </mesh>
              {/* Barrier rail */}
              <mesh castShadow position={[0, 0.8, 0.9]}>
                <boxGeometry args={[0.1, 0.3, 2]} />
                <meshStandardMaterial 
                  color="#ff3333"
                  metalness={0.4}
                  roughness={0.6}
                  emissive="#ff0000"
                  emissiveIntensity={0.5}
                />
              </mesh>
              {/* Reflector */}
              <mesh position={[0.1, 0.8, 0]}>
                <boxGeometry args={[0.05, 0.1, 0.1]} />
                <meshStandardMaterial 
                  color="#ffaa00"
                  emissive="#ffaa00"
                  emissiveIntensity={1}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  )
}

function InfiniteRoad() {
  const roadRef = useRef()
  const [segments, setSegments] = useState([])
  const segmentLength = 20
  const numSegments = 5
  const [currentRotation, setCurrentRotation] = useState(0)

  // Initialize road segments
  useEffect(() => {
    const initialSegments = []
    for (let i = 0; i < numSegments; i++) {
      initialSegments.push({
        position: [0, 0, -segmentLength * i],
        rotation: [0, 0, 0],
        curve: 0
      })
    }
    setSegments(initialSegments)
  }, [])

  // Update road segments based on car position
  useFrame((state) => {
    if (!roadRef.current) return

    const carPosition = state.camera.position
    const lastSegment = segments[segments.length - 1]
    const firstSegment = segments[0]

    // Check if we need to add new segments
    if (carPosition.z < lastSegment.position[2] + segmentLength * 2) {
      // Add some randomness to the road
      const curve = (Math.random() - 0.5) * 0.2
      setCurrentRotation(prev => prev + curve)
      
      const newSegment = {
        position: [
          Math.sin(currentRotation) * 5,
          0,
          lastSegment.position[2] - segmentLength
        ],
        rotation: [0, currentRotation, 0],
        curve
      }
      setSegments(prev => [...prev, newSegment])
    }

    // Check if we need to remove old segments
    if (carPosition.z > firstSegment.position[2] + segmentLength * 2) {
      setSegments(prev => prev.slice(1))
    }
  })

  return (
    <group ref={roadRef}>
      {segments.map((segment, index) => (
        <RoadSegment 
          key={index}
          position={segment.position}
          rotation={segment.rotation}
          curve={segment.curve}
        />
      ))}
    </group>
  )
}

function Terrain() {
  return (
    <group>
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000, 64, 64]} />
        <meshStandardMaterial 
          color="#4a8555"
          roughness={0.8}
          metalness={0.1}
          dithering={true}
        />
      </mesh>
    </group>
  )
}

function SceneEnvironment() {
  return (
    <>
      <Sky 
        distance={450000} 
        sunPosition={[1, 2, 1]} 
        inclination={0.6}
        azimuth={0.25}
        mieCoefficient={0.005}
        mieDirectionalG={0.7}
        rayleigh={0.5}
        turbidity={0.1}
      />
      
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0001}
        color="#ffeedd"
      />
      <hemisphereLight
        position={[0, 50, 0]}
        intensity={1}
        color="#87ceeb"
        groundColor="#2a603b"
      />
    </>
  )
}

function VehicleCamera({ carRef }) {
  const cameraRef = useRef()
  const targetPosition = new THREE.Vector3()
  const targetRotation = new THREE.Euler()

  useFrame((state) => {
    if (!carRef.current) return

    const car = carRef.current
    const carPosition = car.position
    const carRotation = car.rotation

    // Calculate camera position behind and above the car
    const distance = 8
    const height = 3
    const offset = new THREE.Vector3(0, height, distance)
    
    // Apply car's rotation to the offset
    offset.applyQuaternion(car.quaternion)
    
    // Set target position
    targetPosition.copy(carPosition).add(offset)
    
    // Look at the car
    targetRotation.set(
      -Math.atan2(height, distance),
      carRotation.y,
      0
    )

    // Smoothly interpolate camera position and rotation
    state.camera.position.lerp(targetPosition, 0.1)
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetRotation.x, 0.1)
    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, targetRotation.y, 0.1)
  })

  return null
}

const Scene = () => {
  const carRef = useRef()
  const [activeCheckpoint, setActiveCheckpoint] = useState(0)
  const [carSpeed, setCarSpeed] = useState(0)
  const [carScore, setCarScore] = useState(0)
  const [carLapTime, setCarLapTime] = useState(0)
  const [carBestLap, setCarBestLap] = useState(Infinity)

  const checkpoints = [
    { position: [0, 0, 20] },
    { position: [10, 0, 40] },
    { position: [-10, 0, 60] },
    { position: [0, 0, 80] }
  ]

  const handleCheckpointPass = (carPosition, lastCheckpoint, setLastCheckpoint, setLapTime, setBestLap) => {
    const currentCheckpoint = checkpoints[activeCheckpoint]
    const distance = carPosition.distanceTo(new THREE.Vector3(...currentCheckpoint.position))

    if (distance < 3) {
      if (activeCheckpoint === 0 && lastCheckpoint === checkpoints.length - 1) {
        if (carLapTime < carBestLap) {
          setCarBestLap(carLapTime)
        }
        setCarLapTime(0)
      }
      setActiveCheckpoint((prev) => (prev + 1) % checkpoints.length)
      setLastCheckpoint(activeCheckpoint)
    }
  }

  return (
    <>
      <SceneEnvironment />
      <Terrain />
      <InfiniteRoad />
      
      {/* Checkpoints */}
      {checkpoints.map((checkpoint, index) => (
        <Checkpoint
          key={index}
          position={checkpoint.position}
          isActive={index === activeCheckpoint}
          onPass={handleCheckpointPass}
        />
      ))}

      <Suspense fallback={null}>
        <Car 
          ref={carRef}
          onCheckpointPass={handleCheckpointPass}
          onSpeedChange={setCarSpeed}
          onScoreChange={setCarScore}
          onLapTimeChange={setCarLapTime}
          onBestLapChange={setCarBestLap}
        />
      </Suspense>

      <VehicleCamera carRef={carRef} />

      <UI 
        speed={carSpeed}
        score={carScore}
        lapTime={carLapTime}
        bestLap={carBestLap}
      />

      <OrbitControls
        makeDefault
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={20}
        enableDamping
        dampingFactor={0.05}
      />
      <Environment preset="sunset" />
    </>
  )
}

export default Scene 