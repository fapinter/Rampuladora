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
  const [outputs, setOutputs] = useState({
    numLandings: 0,
    incDegrees: 0,
    incPercentage: 0,
    totalLength: 0,
    rampHeight: 0,
    numSegments: 0
  });
  const LANDING_LENGTH = 1.2;
  const LIMIT_SEGMENTS = 15;

  const handleBlur = (setter) => (e) => {
    let value = parseFloat(e.target.value);

    if(!isNaN(value)){
      const formattedValue = parseFloat(value.toFixed(2));
      
      setter(formattedValue);
    }
  }


  function getLandings(inc, size){
    const patamares = new Array();
    let limitate_segments = false;
    let num_segments = 0;
    if(checkIntermediates){
      let step = NaN;
      
      if(inc < 5){step = 1.5}
      else if(inc <= 6.25){step = 1}
      else if (inc > 6.25 && inc <= 8.33){step = 0.8; limitate_segments = true}

      //Patamares intermediários por limite de altura
      for(let curr_height = step; curr_height <=height; curr_height += step){
        num_segments += 1;
        const ratio = height / curr_height;
        const curr_length = size/ratio;
        patamares.push(curr_length);
      }
      
    }
    const temp_size = size + LANDING_LENGTH * patamares.length;
    console.log('temp_size', temp_size);

    //Patamares a cada 50 metros caso não exista um dentro deste intervalo
    if(checkEvery50m){
      let last_step = 0;
      for(let i = 50; i <= temp_size; i+= 50){
        const landings_in_between = patamares.filter(item => {
          if(item > last_step && item <= last_step){ return item; }
        });

        if (landings_in_between.length > 0){
          patamares.push(i);
        }
        
        last_step = i;
      }
    }
    
    if(checkEnds){
      patamares.push(0);
      patamares.push(size);
    }
    const return_size = size + LANDING_LENGTH * patamares.length;
    console.log('patamares', patamares);

    return [return_size, limitate_segments, num_segments, patamares.length]
  }

  function calculate(){
    console.log('height', height);
    console.log('length', length);
    console.log('inclination', inclination);
    if(type_calculator === 'comprimento'){
      let inc = inclinationUnit === 'degrees'? Math.tan(inclination) * 100 : inclination;
      const inc_degrees = parseFloat((Math.atan(inc/100) * (180 / Math.PI)).toFixed(2));
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

      let size = ( height * 100 ) / inc;
      let limitate_segments = false;
      let num_segments = 0;
      let num_landings = 0;
      let final_size = 0;
      console.log('initial-size: ', size);
      [size, limitate_segments, num_segments, num_landings] = getLandings(inc, size);
      console.log('limit segments', limitate_segments);
      console.log('num_segments',num_segments);
      console.log('num_landings',num_landings);
      console.log('final-size', size);

      
      setOutputs({
        totalLength : size,
        incPercentage : inc,
        incDegrees : inc_degrees,
        height : height,
        numSegments : num_segments,
        numLandings : num_landings,
      });

      
    }
    else{

      const inc_percentage = (height * 100) / length;
      const inc_degrees = parseFloat((Math.atan(inc/100) * (180 / Math.PI)).toFixed(2));
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
      console.log(inc);

      let size = ( height * 100 ) / inc_percentage;
      let limitate_segments = false;
      let num_segments = 0;
      let num_landings = 0;
      console.log('initial-size: ', size);
      size, limitate_segments, num_segments, num_landings = getLandings(inc_percentage, size);
      console.log('final-size', size);
      
      setOutputs({
        totalLength : size,
        incPercentage : inc_percentage,
        incDegrees : inc_degrees,
        height : height,
        numSegments : num_segments,
        numLandings : num_landings,
      });
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
                onBlur={handleBlur(setHeight)}
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
                    onBlur={handleBlur(setInclination)}
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
                  onBlur={handleBlur(setLength)}
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
              <span className="output-value">{outputs.height}m</span>
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
              <span className="output-value">{outputs.incPercentage}%</span>
            </div>
            <div className="output-card">
              <span className="output-label">Inclinação Graus</span>
              <span className="output-value" >{outputs.incDegrees}°</span>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default App;