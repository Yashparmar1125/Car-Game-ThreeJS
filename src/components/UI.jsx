import { Html } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'

export default function UI({ speed, score, lapTime, bestLap }) {
  const [isVisible, setIsVisible] = useState(true)

  // Toggle UI visibility with Tab key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Tab') {
        setIsVisible(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!isVisible) return null

  return (
    <Html position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px 20px',
        borderRadius: '5px'
      }}>
        <div>Speed: {Math.abs(Math.round(speed * 50))} km/h</div>
        <div>Score: {score}</div>
        <div>Lap Time: {lapTime.toFixed(2)}s</div>
        <div>Best Lap: {bestLap.toFixed(2)}s</div>
      </div>
    </Html>
  )
} 