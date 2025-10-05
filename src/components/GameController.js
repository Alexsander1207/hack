// src/components/GameController.js
import React, { useState, useCallback } from 'react';
import { nasaDataSim } from '../data/nasaSim'; 
import DecisionPanel from './DecisionPanel';
import Parche3D from './Parche3D';

const GameController = () => {
  // 1. ESTADO CENTRAL DEL JUEGO
  const [etapa, setEtapa] = useState(1);
  const totalEtapas = nasaDataSim.length;

  const [rendimiento, setRendimiento] = useState(50);
  const [sostenibilidad, setSostenibilidad] = useState(75);
  const [riesgoRancha, setRiesgoRancha] = useState(10);
  const [mensajeFeedback, setMensajeFeedback] = useState("👆 Observa el Reporte Satelital NASA a tu izquierda y luego elige una acción a la derecha.");
  
  // Estados adicionales para mejor UX
  const [tipoFeedback, setTipoFeedback] = useState('info'); // 'success', 'warning', 'error', 'info'
  const [animandoStats, setAnimandoStats] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [mostrarTutorial, setMostrarTutorial] = useState(true);
  const [bloqueado, setBloqueado] = useState(false);

  const datosNASAActuales = nasaDataSim[etapa - 1];

  // FUNCIÓN AUXILIAR MEJORADA PARA DAR ESTILO (retorna color hex)
  const getColorHex = (valor) => {
    if (valor === 'ALTO' || valor === 'MUY SECO' || valor === 'Muy Alto') return '#e74c3c';
    if (valor === 'Moderado' || valor === 'Seco' || valor === 'Bajo') return '#f39c12';
    if (valor === 'Ideal' || valor === 'Saturado') return '#27ae60';
    return '#95a5a6';
  };

  
  // 2. FUNCIÓN CENTRAL: EL MOTOR DEL JUEGO (Lógica de Consecuencias MEJORADA)
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
          feedback = "✅ ¡Excelente decisión! El SMAP mostró sequía. Riego eficiente y oportuno.";
          tipo_feedback = "success";
        } else if (SMAP === 'Saturado') {
          nuevaSostenibilidad -= 5;
          feedback = "⚠️ El SMAP estaba Saturado. El riego fue innecesario y gastó agua.";
          tipo_feedback = "warning";
        } else {
          feedback = "💧 Riego ligero aplicado. Mantenimiento normal del cultivo.";
          tipo_feedback = "info";
        }
      } else if (valor === 'abundante') {
        if (SMAP === 'MUY SECO') {
          nuevoRendimiento += 25;
          nuevaSostenibilidad -= 5;
          feedback = "📈 Decisión agresiva pero necesaria. El SMAP era MUY SECO. Salvaste la cosecha.";
          tipo_feedback = "warning";
        } else if (SMAP === 'Saturado' || Clima === 'ALTO') {
          nuevaSostenibilidad -= 15;
          nuevoRiesgoRancha += 20;
          feedback = "❌ ¡Error grave! Suelo saturado + riego = desperdicio y mayor riesgo de Rancha.";
          tipo_feedback = "error";
        } else {
          nuevaSostenibilidad -= 8;
          feedback = "⚠️ Riego abundante sin necesidad urgente. Desperdicio de recursos.";
          tipo_feedback = "warning";
        }
      } else if (valor === 'no_regar') {
        if (SMAP === 'MUY SECO') {
          nuevoRendimiento -= 20;
          feedback = "🚨 El cultivo necesitaba agua urgente. Pérdida significativa de rendimiento.";
          tipo_feedback = "error";
        } else if (SMAP === 'Saturado') {
          nuevaSostenibilidad += 10;
          feedback = "✅ Decisión inteligente. Ahorraste agua cuando no era necesario regar.";
          tipo_feedback = "success";
        } else {
          feedback = "⏸️ Sin riego aplicado. El cultivo mantiene su estado actual.";
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
          feedback = "🌱 ¡Perfecto! El NDVI era bajo. El orgánico mejorará el suelo gradualmente.";
          tipo_feedback = "success";
        } else if (NDVI === 'Muy Alto') {
          nuevaSostenibilidad -= 5;
          feedback = "⚠️ El NDVI ya era alto. Fertilizar de más es innecesario.";
          tipo_feedback = "warning";
        } else {
          nuevaSostenibilidad += 3;
          feedback = "🌿 Fertilización orgánica aplicada. Beneficio a largo plazo.";
          tipo_feedback = "info";
        }
      } else if (valor === 'quimico') {
        if (NDVI === 'Bajo') {
          nuevoRendimiento += 20;
          nuevaSostenibilidad -= 10;
          feedback = "📈 Boost rápido logrado, pero con impacto ambiental negativo.";
          tipo_feedback = "warning";
        } else {
          nuevaSostenibilidad -= 15;
          feedback = "❌ Químicos innecesarios. Daño ambiental sin beneficio real.";
          tipo_feedback = "error";
        }
      } else if (valor === 'no_fertilizar') {
        if (NDVI === 'Bajo') {
          nuevoRendimiento -= 5;
          feedback = "⚠️ El NDVI era bajo. El cultivo necesitaba nutrientes.";
          tipo_feedback = "warning";
        } else {
          feedback = "⏸️ Sin fertilización. El cultivo mantiene su vigor actual.";
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
          feedback = "🛡️ ¡Prevención sostenible exitosa! El riesgo de Rancha era ALTO.";
          tipo_feedback = "success";
        } else {
          nuevaSostenibilidad += 3;
          nuevoRiesgoRancha -= 10;
          feedback = "🌿 Control biológico aplicado preventivamente.";
          tipo_feedback = "info";
        }
      } else if (valor === 'quimico') {
        if (Clima === 'ALTO') {
          nuevoRiesgoRancha -= 40;
          nuevaSostenibilidad -= 15;
          feedback = "💊 Control químico máximo. Rancha reducida drásticamente, gran impacto ambiental.";
          tipo_feedback = "warning";
        } else {
          nuevaSostenibilidad -= 10;
          nuevoRiesgoRancha -= 15;
          feedback = "⚠️ Químico aplicado sin necesidad urgente. Daño ambiental.";
          tipo_feedback = "warning";
        }
      } else if (valor === 'esperar') {
        if (Clima === 'ALTO') {
          nuevoRiesgoRancha += 30;
          nuevoRendimiento -= 20;
          feedback = "🔥 ¡DESASTRE! El clima era de ALTO riesgo. La Rancha se propagó rápidamente.";
          tipo_feedback = "error";
        } else {
          feedback = "⏳ Observación sin acción. Situación estable por ahora.";
          tipo_feedback = "info";
        }
      }
    }

    // --- EFECTOS GLOBALES ---
    if (nuevoRiesgoRancha >= 50) {
      nuevoRendimiento -= 25;
      feedback += " 🚨 ¡ALERTA CRÍTICA! La Rancha se manifestó por riesgo acumulado. Gran pérdida de cosecha.";
      tipo_feedback = "error";
    }
    
    // Limitar valores entre 0 y 100
    nuevoRendimiento = Math.min(100, Math.max(0, nuevoRendimiento));
    nuevaSostenibilidad = Math.min(100, Math.max(0, nuevaSostenibilidad));
    nuevoRiesgoRancha = Math.max(0, nuevoRiesgoRancha + 10); // Riesgo base aumenta cada turno
    
    // Guardar decisión en historial
    setHistorial(prev => [...prev, {
      etapa,
      tipo,
      valor,
      feedback,
      rendimiento: nuevoRendimiento,
      sostenibilidad: nuevaSostenibilidad,
      riesgoRancha: nuevoRiesgoRancha
    }]);

    // Animar cambios en las estadísticas
    setAnimandoStats(true);
    setTimeout(() => setAnimandoStats(false), 500);
    
    // Actualizar estados
    setRendimiento(nuevoRendimiento);
    setSostenibilidad(nuevaSostenibilidad);
    setRiesgoRancha(nuevoRiesgoRancha);
    setMensajeFeedback(feedback || "Decisión tomada. Observa la nueva situación en el satélite.");
    setTipoFeedback(tipo_feedback);
    
    // Avanzar etapa después de un delay (para que el usuario vea el feedback)
    setTimeout(() => {
      setEtapa(prev => prev + 1);
      setBloqueado(false);
    }, 2000);
  }, [datosNASAActuales, rendimiento, sostenibilidad, riesgoRancha, etapa]); 

  // 3. RENDERIZADO DE LA PANTALLA FINAL (SIN CAMBIOS)
  if (etapa > totalEtapas) {
    const puntuacionFinal = (rendimiento * 0.7) + (sostenibilidad * 0.3);
    
    let evaluacion = "";
    let medalla = "";
    let colorMedalla = "";
    
    if (puntuacionFinal >= 80) {
      evaluacion = "¡Agricultor Maestro! Excelente equilibrio entre producción y sostenibilidad.";
      medalla = "🥇";
      colorMedalla = "#FFD700";
    } else if (puntuacionFinal >= 60) {
      evaluacion = "Buen desempeño. Hay espacio para mejorar el balance sostenible.";
      medalla = "🥈";
      colorMedalla = "#C0C0C0";
    } else if (puntuacionFinal >= 40) {
      evaluacion = "Desempeño regular. Necesitas entender mejor los datos NASA.";
      medalla = "🥉";
      colorMedalla = "#CD7F32";
    } else {
      evaluacion = "Necesitas más práctica. Revisa cómo interpretar SMAP, NDVI y Clima.";
      medalla = "📚";
      colorMedalla = "#95a5a6";
    }

    return (
      <div className="game-container final-screen">
        <div className="final-card">
          <div className="final-header">
            <h1 style={{ fontSize: '2.5em', margin: '20px 0' }}>
              {medalla} Cosecha Finalizada {medalla}
            </h1>
            <h2 style={{ color: colorMedalla, fontSize: '1.8em', margin: '10px 0' }}>
              {evaluacion}
            </h2>
          </div>

          <div className="final-stats-container">
            <div className="stat-bar-wrapper">
              <div className="stat-header">
                <span className="stat-label">✅ Rendimiento de Cosecha</span>
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
                <span className="stat-label">🌳 Sostenibilidad Ambiental</span>
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
              <h3>🏆 Puntuación Final</h3>
              <div className="score-value" style={{ color: colorMedalla }}>
                {puntuacionFinal.toFixed(1)}
              </div>
              <p className="score-formula">
                (70% Rendimiento + 30% Sostenibilidad)
              </p>
            </div>
          </div>

          <div className="decision-history">
            <h3>📊 Resumen de tus Decisiones</h3>
            <div className="history-scroll">
              {historial.map((h, i) => (
                <div key={i} className="history-item">
                  <strong>Etapa {h.etapa}:</strong> {h.tipo} → <em>{h.valor}</em>
                  <br />
                  <small>{h.feedback}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="educational-note">
            <h4>💡 Aprendizaje Clave</h4>
            <p>
              El éxito en la agricultura moderna combina <strong>tecnología satelital NASA</strong> 
              (SMAP para humedad, NDVI para vigor vegetal, datos climáticos para plagas) con 
              <strong> decisiones sostenibles</strong> que equilibran productividad económica y 
              cuidado del medio ambiente. ¡Los pequeños agricultores pueden ser guardianes del planeta!
            </p>
          </div>

          <button className="btn-restart" onClick={() => window.location.reload()}>
            🔄 Jugar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  // 4. NUEVO LAYOUT: 3 COLUMNAS (Datos NASA | Visualización 3D | Controles)
  return (
    <div className="game-container">
      <header className="game-header">
        <h1>🥔 EcoGuardia de la Papa Nativa 🛰️</h1>
        <div className="progress-indicator">
          Etapa {etapa} de {totalEtapas}
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
            <h2>🎓 ¿Cómo Jugar?</h2>
            <ol>
              <li>📊 <strong>Observa los datos NASA:</strong> SMAP (humedad), NDVI (vigor), Clima (riesgo rancha)</li>
              <li>🎯 <strong>Toma decisiones:</strong> Riego, fertilización y protección</li>
              <li>⚖️ <strong>Equilibra:</strong> Maximiza rendimiento SIN dañar el medio ambiente</li>
              <li>🏆 <strong>Objetivo:</strong> Lograr alta producción y sostenibilidad</li>
            </ol>
            <button className="btn-start" onClick={() => setMostrarTutorial(false)}>
              ¡Empezar a Jugar! 🚀
            </button>
          </div>
        </div>
      )}

      {/* NUEVO LAYOUT DE 3 COLUMNAS */}
      <div className="game-layout-tres-columnas">
        
        {/* COLUMNA IZQUIERDA: Reporte NASA compacto + Estadísticas */}
        <div className="columna-izquierda">
          {/* REPORTE SATELITAL NASA - Compacto */}
          <div className="reporte-nasa-card">
            <div className="reporte-header">
              <span className="satellite-icon">🛰️</span>
              <div>
                <h3>Reporte NASA</h3>
                <small>Etapa {etapa}</small>
              </div>
            </div>
            
            {datosNASAActuales && (
              <div className="reporte-grid">
                {/* NDVI */}
                <div className="reporte-mini">
                  <span className="mini-icon">🌱</span>
                  <div className="mini-info">
                    <small>Vigor (NDVI)</small>
                    <div 
                      className="mini-badge" 
                      style={{ backgroundColor: getColorHex(datosNASAActuales.NDVI) }}
                    >
                      {datosNASAActuales.NDVI}
                    </div>
                  </div>
                </div>

                {/* SMAP */}
                <div className="reporte-mini">
                  <span className="mini-icon">💧</span>
                  <div className="mini-info">
                    <small>Humedad (SMAP)</small>
                    <div 
                      className="mini-badge" 
                      style={{ backgroundColor: getColorHex(datosNASAActuales.SMAP) }}
                    >
                      {datosNASAActuales.SMAP}
                    </div>
                  </div>
                </div>

                {/* Clima */}
                <div className="reporte-mini">
                  <span className="mini-icon">⛈️</span>
                  <div className="mini-info">
                    <small>Riesgo Rancha</small>
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
              <summary>¿Qué significan?</summary>
              <div className="ayuda-content">
                <p><strong>NDVI:</strong> Vigor de plantas</p>
                <p><strong>SMAP:</strong> Humedad del suelo</p>
                <p><strong>Clima:</strong> Riesgo de plagas</p>
              </div>
            </details>
          </div>

          {/* Panel de Estadísticas */}
          <div className="panel-stats">
            <h3>📊 Estado del Cultivo</h3>
            
            <div className="stat-item">
              <div className="stat-label-row">
                <span>✅ Rendimiento</span>
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
                <span>🌳 Sostenibilidad</span>
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
                <span>🚨 Riesgo Rancha</span>
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

          {/* Feedback del turno */}
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

        {/* COLUMNA CENTRAL: Visualización 3D */}
        <div className="columna-central">
          <div className="viz-header">
            <h3>🌾 Visualización 3D</h3>
            <span className="tech-badge">Powered by Three.js</span>
          </div>
          
          <div className={`viz-container-central ${bloqueado ? 'processing' : ''}`}>
            <Parche3D nasaData={datosNASAActuales} />
            {bloqueado && (
              <div className="processing-overlay">
                <div className="spinner"></div>
                <p>Procesando decisión...</p>
              </div>
            )}
          </div>
          
          <details className="legend-details">
            <summary>🔍 Leyenda 3D</summary>
            <ul>
              <li><strong>Color:</strong> Vigor (NDVI) 🌱</li>
              <li><strong>Suelo:</strong> Humedad (SMAP) 💧</li>
              <li><strong>Lluvia:</strong> Riesgo Rancha ⛈️</li>
            </ul>
          </details>
        </div>

        {/* COLUMNA DERECHA: Panel de Decisiones */}
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