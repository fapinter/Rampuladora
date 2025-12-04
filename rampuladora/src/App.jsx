import { useState } from 'react';
import './App.css';

function App() {

  return (
    <div class="main">
        <div class="title-desc">
            <span class="title">A Rampuladora</span>
            <span class="desc">
                A Rampuladora é uma calculadora online para realizar o cálculo de rampas a partir da altura e inclinação da rampa
            </span>

        </div>
        <div class="calculator">
          <div class="inputs">
            <select type="select">asas
              <option value="inclinacao">Inclinação</option>
              <option value="comprimento">Comprimento</option>
              <option value="altura">Altura</option>
            </select>
          </div>
          <div class="outputs">

          </div>

        </div>
    </div>
    
  )
}

export default App
