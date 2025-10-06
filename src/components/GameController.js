// src/components/GameController.js
import React, { useState, useCallback } from 'react';
import { nasaDataSim } from '../data/nasaSim'; 
import DecisionPanel from './DecisionPanel';
import Parche3D from './Parche3D';
import { useTranslation } from 'react-i18next';

const GameController = () => {
  const { t } = useTranslation(); 
  const [etapa, setEtapa] = useState(1);
  const totalEtapas = nasaDataSim.length;

  const [rendimiento, setRendimiento] = useState(50);
  const [sostenibilidad, setSostenibilidad] = useState(75);
  const [riesgoRancha, setRiesgoRancha] = useState(10);
  const [mensajeFeedback, setMensajeFeedback] = useState(t('game.initialFeedback'));
  
  const [tipoFeedback, setTipoFeedback] = useState('info');
  const [animandoStats, setAnimandoStats] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [mostrarTutorial, setMostrarTutorial] = useState(true);
  const [bloqueado, setBloqueado] = useState(false);

  const datosNASAActuales = nasaDataSim[etapa - 1];

  const getColorHex = (valor) => {
    if (valor === 'ALTO' || valor === 'MUY SECO' || valor === 'Muy Alto') return '#e74c3c';
    if (valor === 'Moderado' || valor === 'Seco' || valor === 'Bajo') return '#f39c12';
    if (valor === 'Ideal' || valor === 'Saturado') return '#27ae60';
    return '#95a5a6';
  };

  const manejarDecision = useCallback((tipo, valor) => {
    setBloqueado(true);
    
    const { NDVI, SMAP, Clima } = datosNASAActuales;
    let nuevoRendimiento = rendimiento;
    let nuevaSostenibilidad = sostenibilidad;
    let nuevoRiesgoRancha = riesgoRancha;
    let feedback = "";
    let tipo_feedback = "info";
    
    // --- LÓGICA DE RIEGO ---
    if (tipo === 'riego') {
      if (valor === 'ligero') {
        if (SMAP === 'Seco' || SMAP === 'MUY SECO') {
          nuevoRendimiento += 15;
          feedback = t('feedback.irrigation.lightDry');
          tipo_feedback = "success";
        } else if (SMAP === 'Saturado') {
          nuevaSostenibilidad -= 5;
          feedback = t('feedback.irrigation.lightSaturated');
          tipo_feedback = "warning";
        } else {
          feedback = t('feedback.irrigation.lightNormal');
          tipo_feedback = "info";
        }
      } else if (valor === 'abundante') {
        if (SMAP === 'MUY SECO') {
          nuevoRendimiento += 25;
          nuevaSostenibilidad -= 5;
          feedback = t('feedback.irrigation.heavyVerydry');
          tipo_feedback = "warning";
        } else if (SMAP === 'Saturado' || Clima === 'ALTO') {
          nuevaSostenibilidad -= 15;
          nuevoRiesgoRancha += 20;
          feedback = t('feedback.irrigation.heavySaturated');
          tipo_feedback = "error";
        } else {
          nuevaSostenibilidad -= 8;
          feedback = t('feedback.irrigation.heavyNormal');
          tipo_feedback = "warning";
        }
      } else if (valor === 'no_regar') {
        if (SMAP === 'MUY SECO') {
          nuevoRendimiento -= 20;
          feedback = t('feedback.irrigation.noneVerydry');
          tipo_feedback = "error";
        } else if (SMAP === 'Saturado') {
          nuevaSostenibilidad += 10;
          feedback = t('feedback.irrigation.noneSaturated');
          tipo_feedback = "success";
        } else {
          feedback = t('feedback.irrigation.noneNormal');
          tipo_feedback = "info";
        }
      }
    } 
    
    // --- LÓGICA DE FERTILIZACIÓN ---
    else if (tipo === 'fertilizacion') {
      if (valor === 'organico') {
        if (NDVI === 'Bajo') {
          nuevoRendimiento += 10;
          nuevaSostenibilidad += 5;
          feedback = t('feedback.fertilization.organicLow');
          tipo_feedback = "success";
        } else if (NDVI === 'Muy Alto') {
          nuevaSostenibilidad -= 5;
          feedback = t('feedback.fertilization.organicHigh');
          tipo_feedback = "warning";
        } else {
          nuevaSostenibilidad += 3;
          feedback = t('feedback.fertilization.organicNormal');
          tipo_feedback = "info";
        }
      } else if (valor === 'quimico') {
        if (NDVI === 'Bajo') {
          nuevoRendimiento += 20;
          nuevaSostenibilidad -= 10;
          feedback = t('feedback.fertilization.chemicalLow');
          tipo_feedback = "warning";
        } else {
          nuevaSostenibilidad -= 15;
          feedback = t('feedback.fertilization.chemicalNormal');
          tipo_feedback = "error";
        }
      } else if (valor === 'no_fertilizar') {
        if (NDVI === 'Bajo') {
          nuevoRendimiento -= 5;
          feedback = t('feedback.fertilization.noneLow');
          tipo_feedback = "warning";
        } else {
          feedback = t('feedback.fertilization.noneNormal');
          tipo_feedback = "info";
        }
      }
    } 
    
    // --- LÓGICA DE PROTECCIÓN ---
    else if (tipo === 'proteccion') {
      if (valor === 'biologico') {
        if (Clima === 'ALTO') {
          nuevoRiesgoRancha -= 30;
          nuevaSostenibilidad += 5;
          feedback = t('feedback.protection.bioHigh');
          tipo_feedback = "success";
        } else {
          nuevaSostenibilidad += 3;
          nuevoRiesgoRancha -= 10;
          feedback = t('feedback.protection.bioNormal');
          tipo_feedback = "info";
        }
      } else if (valor === 'quimico') {
        if (Clima === 'ALTO') {
          nuevoRiesgoRancha -= 40;
          nuevaSostenibilidad -= 15;
          feedback = t('feedback.protection.chemHigh');
          tipo_feedback = "warning";
        } else {
          nuevaSostenibilidad -= 10;
          nuevoRiesgoRancha -= 15;
          feedback = t('feedback.protection.chemNormal');
          tipo_feedback = "warning";
        }
      } else if (valor === 'esperar') {
        if (Clima === 'ALTO') {
          nuevoRiesgoRancha += 30;
          nuevoRendimiento -= 20;
          feedback = t('feedback.protection.waitHigh');
          tipo_feedback = "error";
        } else {
          feedback = t('feedback.protection.waitNormal');
          tipo_feedback = "info";
        }
      }
    }

    if (nuevoRiesgoRancha >= 50) {
      nuevoRendimiento -= 25;
      feedback += t('feedback.ranchaCritical');
      tipo_feedback = "error";
    }
    
    nuevoRendimiento = Math.min(100, Math.max(0, nuevoRendimiento));
    nuevaSostenibilidad = Math.min(100, Math.max(0, nuevaSostenibilidad));
    nuevoRiesgoRancha = Math.max(0, nuevoRiesgoRancha + 10);
    
    setHistorial(prev => [...prev, {
      etapa,
      tipo,
      valor,
      feedback,
      rendimiento: nuevoRendimiento,
      sostenibilidad: nuevaSostenibilidad,
      riesgoRancha: nuevoRiesgoRancha
    }]);

    setAnimandoStats(true);
    setTimeout(() => setAnimandoStats(false), 500);
    
    setRendimiento(nuevoRendimiento);
    setSostenibilidad(nuevaSostenibilidad);
    setRiesgoRancha(nuevoRiesgoRancha);
    setMensajeFeedback(feedback || t('feedback.decisionMade'));
    setTipoFeedback(tipo_feedback);
    
    setTimeout(() => {
      setEtapa(prev => prev + 1);
      setBloqueado(false);
    }, 2000);
  }, [datosNASAActuales, rendimiento, sostenibilidad, riesgoRancha, etapa, t]); 

  // PANTALLA FINAL
  if (etapa > totalEtapas) {
    const puntuacionFinal = (rendimiento * 0.7) + (sostenibilidad * 0.3);
    
    let evaluacion = "";
    let medalla = "";
    let colorMedalla = "";
    
    if (puntuacionFinal >= 80) {
      evaluacion = t('final.medals.gold');
      medalla = "🥇";
      colorMedalla = "#FFD700";
    } else if (puntuacionFinal >= 60) {
      evaluacion = t('final.medals.silver');
      medalla = "🥈";
      colorMedalla = "#C0C0C0";
    } else if (puntuacionFinal >= 40) {
      evaluacion = t('final.medals.bronze');
      medalla = "🥉";
      colorMedalla = "#CD7F32";
    } else {
      evaluacion = t('final.medals.study');
      medalla = "📚";
      colorMedalla = "#95a5a6";
    }

    return (
      <div className="game-container final-screen">
        <div className="final-card">
          <div className="final-header">
            <h1 style={{ fontSize: '2.5em', margin: '20px 0' }}>
              {medalla} {t('final.title')} {medalla}
            </h1>
            <h2 style={{ color: colorMedalla, fontSize: '1.8em', margin: '10px 0' }}>
              {evaluacion}
            </h2>
          </div>

          <div className="final-stats-container">
            <div className="stat-bar-wrapper">
              <div className="stat-header">
                <span className="stat-label">{t('final.yieldLabel')}</span>
                <span className="stat-value" style={{ 
                  color: rendimiento >= 70 ? '#27ae60' : rendimiento >= 40 ? '#f39c12' : '#e74c3c' 
                }}>
                  {rendimiento.toFixed(0)}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${rendimiento}%`,
                    background: `linear-gradient(90deg, #27ae60 0%, #2ecc71 100%)`
                  }}
                />
              </div>
            </div>

            <div className="stat-bar-wrapper">
              <div className="stat-header">
                <span className="stat-label">{t('final.sustainabilityLabel')}</span>
                <span className="stat-value" style={{ 
                  color: sostenibilidad >= 70 ? '#3498db' : sostenibilidad >= 40 ? '#f39c12' : '#e74c3c' 
                }}>
                  {sostenibilidad.toFixed(0)}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${sostenibilidad}%`,
                    background: `linear-gradient(90deg, #3498db 0%, #5dade2 100%)`
                  }}
                />
              </div>
            </div>

            <div className="final-score">
              <h3>{t('final.finalScore')}</h3>
              <div className="score-value" style={{ color: colorMedalla }}>
                {puntuacionFinal.toFixed(1)}
              </div>
              <p className="score-formula">
                {t('final.scoreFormula')}
              </p>
            </div>
          </div>

          <div className="decision-history">
            <h3>{t('final.historyTitle')}</h3>
            <div className="history-scroll">
              {historial.map((h, i) => (
                <div key={i} className="history-item">
                  <strong>{t('final.historyStage', { stage: h.etapa })}</strong> {h.tipo} → <em>{h.valor}</em>
                  <br />
                  <small>{h.feedback}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="educational-note">
            <h4>{t('final.learningTitle')}</h4>
            <p dangerouslySetInnerHTML={{ __html: t('final.learningText') }} />
          </div>

          <button className="btn-restart" onClick={() => window.location.reload()}>
            {t('final.restartButton')}
          </button>
        </div>
      </div>
    );
  }

  // LAYOUT PRINCIPAL
  return (
    <div className="game-container">
      <header className="game-header">
        <h1>{t('game.title')}</h1>
        <div className="progress-indicator">
          {t('game.stage', { current: etapa, total: totalEtapas })}
          <div className="progress-dots">
            {Array.from({ length: totalEtapas }).map((_, i) => (
              <span 
                key={i} 
                className={`dot ${i < etapa ? 'completed' : i === etapa - 1 ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </header>

      {mostrarTutorial && etapa === 1 && (
        <div className="tutorial-overlay">
          <div className="tutorial-card">
            <button className="close-tutorial" onClick={() => setMostrarTutorial(false)}>
              ✕
            </button>
            <h2>{t('tutorial.title')}</h2>
            <ol>
              <li dangerouslySetInnerHTML={{ __html: t('tutorial.step1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('tutorial.step2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('tutorial.step3') }} />
              <li dangerouslySetInnerHTML={{ __html: t('tutorial.step4') }} />
            </ol>
            <button className="btn-start" onClick={() => setMostrarTutorial(false)}>
              {t('tutorial.startButton')}
            </button>
          </div>
        </div>
      )}

      <div className="game-layout-tres-columnas">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="columna-izquierda">
          <div className="reporte-nasa-card">
            <div className="reporte-header">
              <span className="satellite-icon">🛰️</span>
              <div>
                <h3>{t('nasa.reportTitle')}</h3>
                <small>{t('nasa.stage', { number: etapa })}</small>
              </div>
            </div>
            
            {datosNASAActuales && (
              <div className="reporte-grid">
                <div className="reporte-mini">
                  <span className="mini-icon">🌱</span>
                  <div className="mini-info">
                    <small>{t('nasa.ndvi')}</small>
                    <div 
                      className="mini-badge" 
                      style={{ backgroundColor: getColorHex(datosNASAActuales.NDVI) }}
                    >
                      {datosNASAActuales.NDVI}
                    </div>
                  </div>
                </div>

                <div className="reporte-mini">
                  <span className="mini-icon">💧</span>
                  <div className="mini-info">
                    <small>{t('nasa.smap')}</small>
                    <div 
                      className="mini-badge" 
                      style={{ backgroundColor: getColorHex(datosNASAActuales.SMAP) }}
                    >
                      {datosNASAActuales.SMAP}
                    </div>
                  </div>
                </div>

                <div className="reporte-mini">
                  <span className="mini-icon">⛈️</span>
                  <div className="mini-info">
                    <small>{t('nasa.climate')}</small>
                    <div 
                      className="mini-badge" 
                      style={{ backgroundColor: getColorHex(datosNASAActuales.Clima) }}
                    >
                      {datosNASAActuales.Clima}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <details className="reporte-ayuda">
              <summary>{t('nasa.helpTitle')}</summary>
              <div className="ayuda-content">
                <p dangerouslySetInnerHTML={{ __html: t('nasa.ndviHelp') }} />
                <p dangerouslySetInnerHTML={{ __html: t('nasa.smapHelp') }} />
                <p dangerouslySetInnerHTML={{ __html: t('nasa.climateHelp') }} />
              </div>
            </details>
          </div>

          <div className="panel-stats">
            <h3>{t('stats.title')}</h3>
            
            <div className="stat-item">
              <div className="stat-label-row">
                <span>{t('stats.yield')}</span>
                <span className={`stat-number ${animandoStats ? 'pulse' : ''}`}>
                  {rendimiento.toFixed(0)}%
                </span>
              </div>
              <div className="mini-bar">
                <div 
                  className="mini-fill" 
                  style={{ 
                    width: `${rendimiento}%`, 
                    backgroundColor: rendimiento >= 60 ? '#27ae60' : '#e74c3c'
                  }}
                />
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-label-row">
                <span>{t('stats.sustainability')}</span>
                <span className={`stat-number ${animandoStats ? 'pulse' : ''}`}>
                  {sostenibilidad.toFixed(0)}%
                </span>
              </div>
              <div className="mini-bar">
                <div 
                  className="mini-fill" 
                  style={{ 
                    width: `${sostenibilidad}%`, 
                    backgroundColor: sostenibilidad >= 60 ? '#3498db' : '#e74c3c'
                  }}
                />
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-label-row">
                <span>{t('stats.ranchRisk')}</span>
                <span className={`stat-number ${animandoStats ? 'pulse' : ''}`}>
                  {riesgoRancha.toFixed(0)}%
                </span>
              </div>
              <div className="mini-bar">
                <div 
                  className="mini-fill" 
                  style={{ 
                    width: `${riesgoRancha}%`, 
                    backgroundColor: riesgoRancha >= 50 ? '#e74c3c' : '#f39c12'
                  }}
                />
              </div>
            </div>
          </div>

          <div className={`feedback-box feedback-${tipoFeedback}`}>
            <div className="feedback-icon">
              {tipoFeedback === 'success' && '✅'}
              {tipoFeedback === 'warning' && '⚠️'}
              {tipoFeedback === 'error' && '❌'}
              {tipoFeedback === 'info' && '📢'}
            </div>
            <p>{mensajeFeedback}</p>
          </div>
        </div>

        {/* COLUMNA CENTRAL */}
        <div className="columna-central">
          <div className="viz-header">
            <h3>{t('visualization.title')}</h3>
          </div>
          
          <div className={`viz-container-central ${bloqueado ? 'processing' : ''}`}>
            <Parche3D nasaData={datosNASAActuales} />
            {bloqueado && (
              <div className="processing-overlay">
                <div className="spinner"></div>
                <p>{t('feedback.processing')}</p>
              </div>
            )}
          </div>
          
          <details className="legend-details">
            <summary>{t('visualization.legendTitle')}</summary>
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t('visualization.legendColor') }} />
              <li dangerouslySetInnerHTML={{ __html: t('visualization.legendSoil') }} />
              <li dangerouslySetInnerHTML={{ __html: t('visualization.legendRain') }} />
            </ul>
          </details>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="columna-derecha">
          <DecisionPanel 
            manejarDecision={manejarDecision} 
            datosNASA={datosNASAActuales}
            bloqueado={bloqueado}
          />
        </div>

      </div>
    </div>
  );
};

export default GameController;