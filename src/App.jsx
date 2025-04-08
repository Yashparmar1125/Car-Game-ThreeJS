import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Car from './components/Car'
import Scene from './components/Scene'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        camera={{
          position: [0, 5, 10],
          fov: 75
        }}
      >
        <Suspense fallback={null}>
          <Scene>
            <Car />
          </Scene>
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
