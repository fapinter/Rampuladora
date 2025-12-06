import React, { useState } from 'react';
import './App.css';

const App = () => {
  // State for inputs
  const [inclination, setInclination] = useState('');
  const [inclinationUnit, setInclinationUnit] = useState('percentage'); // 'percentage' or 'degrees'
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  
  const [checkEvery50m, setCheckEvery50m] = useState(false);
  const [checkIntermediates, setCheckIntermediates] = useState(false);
  const [checkEnds, setCheckEnds] = useState(false);
  
  const [type_calculator, setTypeCalculator] = useState('comprimento');
  const [exception, setException] = useState('none');

  // Outputs (Mock values since logic is not required)
  const outputs = {
    numLandings: 0,
    incDegrees: 0,
    incPercentage: 0,
    totalLength: 0,
    rampHeight: 0,
    numSegments: 0
  };

  return (
    <div className="container">
      <header>
        <h1>A Rampuladora</h1>
      </header>

      <div className="main-grid">
        {/* Input Column */}
        <section className="input-section">
          <div className="title-wrapper">
            <span className="section-title">Parâmetros</span>
          </div>
          <div className="input-wrapper">
            <label>Calcular: </label>
            <select
              className="input-field"
              value={type_calculator}
              onChange={(ev) => setTypeCalculator(ev.target.value)}
            >
              <option value="comprimento">Comprimento</option>
              <option value="inclinacao">Inclinação</option>
            </select>
          </div>

          {/* Inclination Input */}
          <div className="input-row">
            <div className="input-wrapper-row" style={{'width':'40%'}}>
              <label>Altura (m)</label>
              <input
                type="number"
                className="input-field"
                placeholder="0.00"
                value={length}
                onChange={(ev) => setLength(ev.target.value)}
              />
            </div>
            {/* Change to inclinacao input*/}
            {type_calculator === 'comprimento' ? (
              <div className="input-wrapper-row" style={{'width':'60%', 'margin-bottom':'0px'}}>
                <label>Inclinação</label>
                <div className="input-row-inc">
                  <input
                    type="number"
                    className="input-inc"
                    placeholder="0.00"
                    value={inclination}
                    onChange={(ev) => setInclination(ev.target.value)}
                  />
                  <div className="unit-toggle">
                    <button
                      className={`unit-btn ${inclinationUnit === 'degrees' ? 'active' : ''}`}
                      onClick={() => setInclinationUnit('degrees')}
                    >
                      °
                    </button>
                    <button
                      className={`unit-btn ${inclinationUnit === 'percentage' ? 'active' : ''}`}
                      onClick={() => setInclinationUnit('percentage')}
                    >
                      %
                    </button>
                  </div>
                </div>
              </div>
            ): (
              <div className="input-wrapper-row" style={{'width': '60%', 'margin-bottom':'0px'}}>
                <label>Comprimento (m)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0.00"
                  value={height}
                  onChange={(ev) => setHeight(ev.target.value)}
                />
              </div>
            )}  
          </div>        
          
          {/* Checkboxes */}
          <div className="checkbox-wrapper">
            <label className="checkbox-label">
              <input
                className="checkbox-input"
                type="checkbox"
                checked={checkEvery50m}
                onChange={(ev) => setCheckEvery50m(ev.target.checked)}
              />
              Considerar patamar a cada 50 metros
            </label>
            <label className="checkbox-label">
              <input
                className="checkbox-input"
                type="checkbox"
                checked={checkIntermediates}
                onChange={(ev) => setCheckIntermediates(ev.target.checked)}
              />
              Considerar patamares intermediários
            </label>
            <label className="checkbox-label">
              <input
                className="checkbox-input"
                type="checkbox"
                checked={checkEnds}
                onChange={(ev) => setCheckEnds(ev.target.checked)}
              />
              Considerar patamares inicial e final
            </label>
          </div>

          {/* Exception Select */}
          <div className="input-wrapper">
            <label>Casos Extremos</label>
            <select
              className="input-field"
              value={exception}
              onChange={(ev) => setException(ev.target.value)}
            >
              <option value="none">Nenhum</option>
              <option value="pool">Piscinas</option>
              <option value="theater_corridor">Corredores de Teatro</option>
              <option value="stage_access">Subida Palco - Teatro</option>
            </select>
          </div>
          <button className="btn-calc" onClick={() => calculate()}>Calcular</button>
        </section>

        {/* Output Column */}
        <section className="output-section">
          <h2 className="section-title" style={{ color: '#eadeda', borderColor: '#eadeda' }}>
            Resultados
          </h2>
          
          <div className="output-grid">
            <div className="output-card">
              <span className="output-label">Inclinação Graus</span>
              <span className="output-value">{outputs.incDegrees}°</span>
            </div>
            <div className="output-card">
              <span className="output-label">Inclinação %</span>
              <span className="output-value">{outputs.incPercentage}%</span>
            </div>
            <div className="output-card">
              <span className="output-label">Comp. Total</span>
              <span className="output-value">{outputs.totalLength}m</span>
            </div>
            <div className="output-card">
              <span className="output-label">Altura Rampa</span>
              <span className="output-value">{outputs.rampHeight}m</span>
            </div>
            <div className="output-card">
              <span className="output-label">Nº Patamares</span>
              <span className="output-value">{outputs.numLandings}</span>
            </div>
            <div className="output-card">
              <span className="output-label">Nº Segmentos</span>
              <span className="output-value">{outputs.numSegments}</span>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default App;