import { useState } from 'react';
import './App.css';
import 'primeicons/primeicons.css';

const App = () => {
  const [inclination, setInclination] = useState(undefined);
  const [length, setLength] = useState(undefined);
  const [height, setHeight] = useState(undefined);
  const [max_inclination, setMaxInclination] = useState(8.33);
  
  const [inclinationUnit, setInclinationUnit] = useState('percentage'); // 'percentage' or 'degrees'
  const [type_calculator, setTypeCalculator] = useState('comprimento');
  const [exception, setException] = useState('none');

  const [checkEvery50m, setCheckEvery50m] = useState(false);
  const [checkIntermediates, setCheckIntermediates] = useState(false);
  const [limitate_segments, setLimitateSegments] = useState(false);
  
  const [outputs, setOutputs] = useState({
    numLandings: 0,
    incDegrees: 0,
    incPercentage: 0,
    totalLength: 0,
    rampHeight: 0,
    numSegments: 0,
    rampLength : 0,
    segmentHeight : 0
  });

  const LANDING_LENGTH = 1.2;
  const LIMIT_SEGMENTS = 15;
  const DEFAULT_MAX_INCLINATION = 8.33;
  const DEFAULT_LIMITATE_SEGMENTS = false;

  const handleBlur = (setter) => (e) => {
    let value = parseFloat(e.target.value);
    if(!isNaN(value)){
      const formattedValue = parseFloat(value.toFixed(2));
      setter(formattedValue);
    }
  }

  const confException = (value) => {
    setException(value);
    if (value !== 'none'){
      setCheckEvery50m(false);
      setCheckIntermediates(false);
      
    }
  }

  function getLandings(inc, size){
    let patamares = new Array();
    const alturas = new Array();
    let num_segments = 1;

    //Patamares intermediários por limite de altura 
    if(checkIntermediates){
      let step = NaN;
      
      if(inc <= 5){step = 1.5}
      else if(inc > 5 && inc <= 6.25){step = 1}
      else if (inc > 6.25 && inc <= 8.33){step = 0.8; setLimitateSegments(true)}

      if(!isNaN(step)){
        for(let curr_height = step; curr_height <=height; curr_height += step){
          //Adiciona um segmento e um patamar
          num_segments += 1;
          alturas.push(curr_height);
          const ratio = height / curr_height;
          const curr_length = size/ratio;
          patamares.push(curr_length);
        }
      }
      else{
        num_segments = 1;
      }
    }
    const temp_size = size + LANDING_LENGTH * patamares.length;

    //Patamares a cada 50 metros caso não exista um dentro deste intervalo
    if(checkEvery50m){
      let final_patamares = patamares;
      let last_step = 0;
      for(let curr_step = 50; curr_step <= temp_size; curr_step+= 50){
        const landings_in_between = patamares.filter(item => {
          if(item > last_step && item <= curr_step){ return item; }
        });

        if (landings_in_between.length === 0){
          final_patamares.push(curr_step);
          num_segments += 1;
        }
        last_step = curr_step;
      }
      patamares = final_patamares;
    }

    const return_size = size + LANDING_LENGTH * patamares.length;
    patamares.sort((a, b) => a - b);

    return [return_size, num_segments, patamares.length];
  }

  function calculate(){
    setOutputs({
      numLandings: 0,
      incDegrees: 0,
      incPercentage: 0,
      totalLength: 0,
      rampHeight: 0,
      numSegments: 0,
      rampLength : 0,
      segmentHeight : 0
    });
    //Variable used for calculation inside the function
    let max_inclination_local = DEFAULT_MAX_INCLINATION;

    //Constants used for Display on the page
    setLimitateSegments(DEFAULT_LIMITATE_SEGMENTS);
    setMaxInclination(DEFAULT_MAX_INCLINATION);

    let inclination_percentage = 0;
    let inclination_degrees = 0;
    let size = 0;
    if(type_calculator === 'comprimento'){
      inclination_percentage = inclinationUnit === 'degrees'? Math.tan(inclination) * 100 : inclination;
      inclination_degrees = inclinationUnit === 'degrees'? inclination : parseFloat((Math.atan(inclination_percentage/100) * (180 / Math.PI)).toFixed(2));
      size = ( height * 100 ) / inclination_percentage;
    }
    else{
      inclination_percentage = (height * 100) / length;
      inclination_degrees = parseFloat((Math.atan(inclination_percentage/100) * (180 / Math.PI)).toFixed(2));
      size = length;
    }
    switch(exception){
      case 'theater_corridor':
        max_inclination_local = 12;
        setMaxInclination(12);
        break;
      case 'stage_access':
        max_inclination_local = height > 0.6 ? 10 : 16.66;
        setMaxInclination(height > 0.6 ? 10 : 16.66);
        break;
      case 'vehicle_ramp':
        max_inclination_local = 20;
        setMaxInclination(20);
        break;
    }
    
    const [final_size, num_segments, num_landings] = getLandings(inclination_percentage, size);

    setOutputs({
        totalLength : final_size.toFixed(2),
        incPercentage : inclination_percentage.toFixed(2),
        incDegrees : inclination_degrees.toFixed(2),
        rampHeight : height.toFixed(2),
        numSegments : num_segments,
        numLandings : num_landings,
        rampLength : size.toFixed(2),
        segmentHeight : (height.toFixed(2) / num_segments).toFixed(4)
    });
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
              onChange={(ev) => confException(ev.target.value)}
            >
              <option value="none">Nenhum</option>
              <option value="theater_corridor">Corredores de Teatro</option>
              <option value="stage_access">Acesso ao Palco</option>
              <option value="vehicle_ramp">Rampa para Veículos</option>
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
          <div className="title-wrapper">
            <span className='section-title'>
              <div>
                <span>Resultados </span>
                <i className='pi pi-info-circle' title='As rampas são calculadas considerando uma rampa reta'></i>
              </div>
            </span>
          </div>
          
          <div className="output-grid">
            <div className="output-card">
              <span className="output-label">Comp. Total
                <span> </span>
                <i className='pi pi-info-circle' title='Considera os Patamares' style={{fontWeight: 'inherit'}}></i>

              </span>
              <span className="output-value">{outputs.totalLength}m</span>
            </div>
            <div className="output-card">
              <span className="output-label">Comp. da Rampa
                <span> </span>
                <i className='pi pi-info-circle' title='Considerando apenas os Segmentos' style={{fontWeight: 'inherit'}}></i>
              </span>
              <span className="output-value">{outputs.rampLength}m</span>
            </div>
            
            <div className="output-card">
              <span className="output-label">Nº Patamares
                <span> </span>
                <i className='pi pi-info-circle' title='Patamares de 1.2m' style={{fontWeight: 'inherit'}}></i>
              </span>
              <span className="output-value">{outputs.numLandings}</span>
              
            </div>  
            <div className="output-card">
              <span className="output-label">Nº Segmentos
                <span> </span>
                {(limitate_segments && outputs.numSegments > LIMIT_SEGMENTS) &&(
                  <i className='pi pi-exclamation-triangle' title='Limite de segmentos excedido (máximo de 15)' style={{fontWeight: 'inherit'}}></i>
                )}
                {(outputs.incPercentage > max_inclination && exception === 'none') && (
                  <i className='pi pi-exclamation-triangle' title='Separação de segmentos indisponível devido à Inclinação' style={{fontWeight: 'inherit'}}></i>
                )}
              </span>
              <span className="output-value">{outputs.numSegments}</span>
            </div> 
            <div className="output-card">
              <span className="output-label">Altura Rampa</span>
              <span className="output-value">{outputs.rampHeight}m</span>
            </div>
            <div className="output-card">
              <span className="output-label">Altura dos Segmentos
                <span> </span>
                <i className='pi pi-info-circle' title='Valor arredondado, favor verificar o cálculo' style={{fontWeight: 'inherit'}}></i>
              </span>
              <span className="output-value">{outputs.segmentHeight}m</span>
            </div>
            <div className="output-card">
              <span className="output-label">Inclinação %
                <span> </span>
                {(outputs.incPercentage > max_inclination) && (
                  <i className='pi pi-exclamation-triangle' title={`Inclinação não acessível (máximo de ${max_inclination})`} style={{fontWeight: 'inherit'}}></i>
                )}
              </span>
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