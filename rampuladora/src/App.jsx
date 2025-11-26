import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='main'>
        <div class="top"></div>
        <div class="title-desc">
            <span class="title">A Rampuladora</span>
            <span class="desc">
                A rampuladora é uma calculadora online para realizar o cálculo de rampas
                a partir da altura e inclinação da rampa
            </span>
        </div>
        <div class="calculator">
        </div>
    </div>
    
  )
}

export default App
