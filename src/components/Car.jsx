import { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Car({ onCheckpointPass }) {
  const carRef = useRef()
  const [speed, setSpeed] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [targetSpeed, setTargetSpeed] = useState(0)
  const [targetRotation, setTargetRotation] = useState(0)
  const [wheelRotations, setWheelRotations] = useState({
    frontLeft: 0,
    frontRight: 0,
    backLeft: 0,
    backRight: 0
  })
  const [suspensionOffset, setSuspensionOffset] = useState(0)
  const [score, setScore] = useState(0)
  const [lapTime, setLapTime] = useState(0)
  const [bestLap, setBestLap] = useState(Infinity)
  const [lastCheckpoint, setLastCheckpoint] = useState(null)
  const wheelRefs = {
    frontLeft: useRef(),
    frontRight: useRef(),
    backLeft: useRef(),
    backRight: useRef()
  }

  // Load the car model with error handling
  const { scene } = useGLTF('/vehicals/car.glb', undefined, (error) => {
    console.error('Error loading car model:', error)
  })

  // Function to log model hierarchy
  const logModelHierarchy = (object, level = 0) => {
    console.log('  '.repeat(level) + object.name + ' (type: ' + object.type + ')')
    object.children.forEach(child => logModelHierarchy(child, level + 1))
  }

  // Handle keyboard controls
  const handleKeyDown = (event) => {
    switch (event.key.toLowerCase()) {
      case 'w':
        setTargetSpeed(2.0)
        break
      case 's':
        setTargetSpeed(-1.0)
        break
      case 'a':
        setTargetRotation(0.5)
        break
      case 'd':
        setTargetRotation(-0.5)
        break
    }
  }

  const handleKeyUp = (event) => {
    switch (event.key.toLowerCase()) {
      case 'w':
      case 's':
        setTargetSpeed(0)
        break
      case 'a':
      case 'd':
        setTargetRotation(0)
        break
    }
  }

  // Add and remove event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Log model hierarchy when loaded
  useEffect(() => {
    if (carRef.current) {
      console.log('Car Model Hierarchy:')
      logModelHierarchy(carRef.current)
    }
  }, [scene])

  // Setup wheel references
  useEffect(() => {
    if (carRef.current) {
      carRef.current.traverse((child) => {
        if (child.type === 'Object3D') {
          switch (child.name) {
            case 'HCR2_HC2_FL_Wheel_10':
              wheelRefs.frontLeft.current = child
              break
            case 'HCR2_HC2_FR_Wheel_11':
              wheelRefs.frontRight.current = child
              break
            case 'HCR2_HC2_RL_Wheel_21':
              wheelRefs.backLeft.current = child
              break
            case 'HCR2_HC2_RR_Wheel_23':
              wheelRefs.backRight.current = child
              break
          }
        }
      })
    }
  }, [scene])

  // Update car position, rotation, and wheel animations
  useFrame((state, delta) => {
    if (!carRef.current || !scene) return

    // Smooth speed transition
    const speedTransitionRate = 4
    const currentSpeed = speed
    const newSpeed = currentSpeed + (targetSpeed - currentSpeed) * speedTransitionRate * delta
    setSpeed(newSpeed)

    // Smooth rotation transition
    const rotationTransitionRate = 5
    const currentRotation = rotation
    const newRotation = currentRotation + (targetRotation - currentRotation) * rotationTransitionRate * delta
    setRotation(newRotation)

    // Update car rotation
    carRef.current.rotation.y += newRotation * delta * 2

    // Calculate movement direction based on car's orientation
    const moveSpeed = newSpeed * delta * 5
    const direction = new THREE.Vector3(0, 0, 1)
    direction.applyQuaternion(carRef.current.quaternion)
    
    // Move the car in its forward direction
    carRef.current.position.add(direction.multiplyScalar(moveSpeed))

    // Update wheel rotations
    const wheelSpeed = moveSpeed * 4
    setWheelRotations(prev => ({
      frontLeft: prev.frontLeft + wheelSpeed,
      frontRight: prev.frontRight + wheelSpeed,
      backLeft: prev.backLeft + wheelSpeed,
      backRight: prev.backRight + wheelSpeed
    }))

    // Add suspension effect
    const suspensionEffect = Math.sin(state.clock.elapsedTime * 5) * 0.05
    setSuspensionOffset(suspensionEffect)

    // Apply wheel rotations and suspension
    Object.entries(wheelRefs).forEach(([wheelName, wheelRef]) => {
      if (wheelRef.current) {
        // Apply suspension
        wheelRef.current.position.y = suspensionEffect
        
        // Apply steering
        if (newRotation !== 0) {
          const isFrontWheel = wheelName.includes('front')
          const steeringAngle = newRotation * (isFrontWheel ? 1 : 0.3)
          wheelRef.current.rotation.y = steeringAngle
        } else {
          wheelRef.current.rotation.y = 0
        }

        // Apply wheel rotation based on speed
        if (Math.abs(newSpeed) > 0.1) {
          const wheelRotationSpeed = newSpeed * delta * 10
          wheelRef.current.rotation.x += wheelRotationSpeed
        }
      }
    })

    // Update lap time
    setLapTime(prev => prev + delta)

    // Check for checkpoint passing
    if (onCheckpointPass) {
      const carPosition = carRef.current.position
      onCheckpointPass(carPosition, lastCheckpoint, setLastCheckpoint, setLapTime, setBestLap)
    }

    // Update score based on speed and drift
    if (Math.abs(newSpeed) > 0.1) {
      const speedScore = Math.abs(newSpeed) * 10
      const driftScore = Math.abs(newRotation) * 20
      setScore(prev => prev + (speedScore + driftScore) * delta)
    }
  })

  // If the model hasn't loaded yet, return null
  if (!scene) {
    return null
  }

  return (
    <primitive
      ref={carRef}
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  )
} 