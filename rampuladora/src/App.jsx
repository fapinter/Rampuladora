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
  const LANDING_LENGTH = 1.2;

  function getLandings(inc, size){
    const patamares = new Set();
    if(checkIntermediates){
      let step = NaN;
      let limitate_segments = false;
      let limit_segments = 15;
      if(inc < 5){
        step = 1.5;
      }
      else if(inc <= 6.25){
        step = 1;
      }
      else{
        step = 0.8;
        limitate_segments = true;
      }
      if(limitate_segments){
        let num_segments = 0;
        
      }
      else{
        for(let curr_height = step; curr_height <=height; curr_height += step){
          const ratio = height / curr_height;
          const curr_length = size/ratio;
          console.log('ratio: ', ratio);
          console.log('curr_length:', curr_length);
          console.log('curr-height: ', curr_height);
          patamares.add(curr_length);
        }
      }
    }
    size += LANDING_LENGTH * patamares.size;
    if(checkEvery50m){
      for(let i = 50; i <= size; i+= 50){
        patamares.add(i);
      }
    }
    
    if(checkEnds){
      patamares.add(0);
      patamares.add(size);
    }
    console.log(patamares);
  }

  function calculate(){

    if(type_calculator === 'comprimento'){
      const inc = inclinationUnit === 'degrees'? Math.tan(inclination) * 100 : inclination;
      let max_inclination = 8.33;

      switch(exception){
        case 'theater_corridor':
          max_inclination = 12;
          break;
        case 'stage_access':
          max_inclination = height > 0.6 ? 10 : 16.66;
          break;
        case 'vehicle_ramp':
          max_inclination = 20;
      }

      if(inc > max_inclination){
        inc = max_inclination;
        console.log('Inclinação acima da Norma, a Inclinação foi alterada para o máximo permitido no cenário');
      }

      console.log(height * 100);
      console.log(inc);
      let size = ( height * 100 ) / inc;
      console.log('initial-size: ', size);
      size = getLandings(inc, size);
      outputs.totalLength = size;
      console.log('final-size', size);
      
    }
    else{
      const inc = inclinationUnit === 'degrees'? Math.tan(inclination) * 100 : inclination;
      let max_inclination = 8.33;
      switch(exception){
        case 'theater_corridor':
          max_inclination = 12;
          break;
        case 'stage_access':
          max_inclination = height > 0.6 ? 10 : 16.66;
          break;
        case 'vehicle_ramp':
          max_inclination = 20;
      }
      if(inc > max_inclination){
        inc = max_inclination;
        console.log('Inclinação acima da Norma, a Inclinação foi alterada para o máximo permitido no cenário');
      }
      console.log(height * 100);
      console.log(inc);
      let size = ( height * 100 ) / inc;
      console.log('initial-size: ', size);
      size = getLandings(inc, size);
      outputs.totalLength = size;
      console.log('final-size', size);

    }

  }

  return (
    <div className="container">
      <div style={{'height': '7.5%', 'marginBottom':'2.5%', 'textAlign': 'center'}}>
        <h1>A Rampuladora</h1>
      </div>

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
                value={height}
                onChange={(ev) => setHeight(ev.target.value)}
              />
            </div>
            {/* Change to inclinacao input*/}
            {type_calculator === 'comprimento' ? (
              <div className="input-wrapper-row" style={{'width':'60%', 'marginBottom':'0px'}}>
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
                  value={length}
                  onChange={(ev) => setLength(ev.target.value)}
                />
              </div>
            )}  
          </div>        
          {/* Exception Select */}
          <div className="input-wrapper">
            <label>Cenários <span style={{'fontSize':'14px'}}>(interferem na inclinação máxima)</span></label>
            <select
              className="input-field"
              value={exception}
              onChange={(ev) => setException(ev.target.value)}
            >
              <option value="none">Nenhum</option>
              <option value="theater_corridor">Corredores de Teatro</option>
              <option value="stage_access">Acesso ao Palco</option>
              <option value="vehicle-ramp">Rampa para Veículos</option>
            </select>
          </div>
          {/* Checkboxes */}
          {exception === 'none'? (
            <div className="checkbox-wrapper">
              <label className="checkbox-label">
              <input
                className="checkbox-input"
                type="checkbox"
                checked={checkEvery50m}
                onChange={(ev) => setCheckEvery50m(ev.target.checked)}
              />
              Patamares a cada 50 metros
              </label>
              <label className="checkbox-label">
                <input
                  className="checkbox-input"
                  type="checkbox"
                  checked={checkIntermediates}
                  onChange={(ev) => setCheckIntermediates(ev.target.checked)}
                />
                Patamares intermediários
              </label>
              <label className="checkbox-label">
                <input
                  className="checkbox-input"
                  type="checkbox"
                  checked={checkEnds}
                  onChange={(ev) => setCheckEnds(ev.target.checked)}
                />
                Patamares inicial e final
              </label>
            </div>
            ): (
              <div className='checkbox-wrapper'>
                <span style={{'font-size': '20px'}}>Patamares não aplicáveis a este cenário</span>
              </div>
            )}
          <button className="btn-calc" onClick={() => calculate()}>Calcular</button>
        </section>

        {/* Output Column */}
        <section className="output-section">
          <h2 className="section-title" style={{ color: '#eadeda', borderColor: '#eadeda' }}>
            Resultados
          </h2>
          
          <div className="output-grid">
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
            <div className="output-card">
              <span className="output-label">Inclinação %</span>
              <span className="output-value">{outputs.incDegrees}%</span>
            </div>
            <div className="output-card">
              <span className="output-label">Inclinação Graus</span>
              <span className="output-value">{outputs.incPercentage}°</span>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default App;