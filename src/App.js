// src/App.js
import React, { useState } from 'react';
import './App.css'; // Usaremos el CSS por defecto
import { nasaDataSim } from './data/nasaSim'; // Lo crearemos en el paso 2

function App() {
  // 1. Estado para seguir la progresión del juego
  const [etapa, setEtapa] = useState(1);
  const totalEtapas = nasaDataSim.length;

  // 2. Estado para los resultados del juego
  const [rendimiento, setRendimiento] = useState(50); // Empieza a 50%
  const [sostenibilidad, setSostenibilidad] = useState(75); // Empieza a 75%
  const [riesgoRancha, setRiesgoRancha] = useState(10); // Riesgo base de tizón

  // 3. Estado para la retroalimentación
  const [mensajeFeedback, setMensajeFeedback] = useState("¡Bienvenido, EcoGuardián! Observa los datos de la NASA y toma tu primera decisión.");

  // Obtenemos los datos de la NASA para la etapa actual
  const datosNASAActuales = nasaDataSim[etapa - 1];

  if (etapa > totalEtapas) {
    // Si el juego ha terminado, mostramos el resultado final
    const puntuacionFinal = (rendimiento * 0.7) + (sostenibilidad * 0.3);

    return (
      <div className="App">
        <div className="game-container">
          <h2>🥔 Cosecha Finalizada - EcoGuardia de la Papa Nativa</h2>
          <p>Has completado las {totalEtapas} semanas de cultivo.</p>
          <div className="final-stats">
            <p>✅ **Rendimiento de Cosecha (Potencial):** {rendimiento.toFixed(0)}%</p>
            <p>🌳 **Sostenibilidad Ambiental:** {sostenibilidad.toFixed(0)}%</p>
            <hr />
            <h3>🏆 Puntuación Final: {puntuacionFinal.toFixed(2)}</h3>
            <p className="educational-note">Tu puntuación refleja cómo el uso (o no uso) de los datos de la NASA impactó tu producción y el medio ambiente.</p>
          </div>
          <button onClick={() => window.location.reload()}>Jugar de Nuevo</button>
        </div>
      </div>
    );
  }

  // Aún estamos jugando
  return (
    <div className="App">
      <div className="game-container">
        <h1>🥔 EcoGuardia de la Papa Nativa 🛰️</h1>
        <h2>Etapa: {etapa} / {totalEtapas} (Semana de Crecimiento)</h2>

        {/* Panel de Estado del Cultivo */}
        <div className="panel-stats">
          <p>✅ Rendimiento: **{rendimiento.toFixed(0)}%**</p>
          <p>🌳 Sostenibilidad: **{sostenibilidad.toFixed(0)}%**</p>
          <p>🚨 Riesgo Rancha: **{riesgoRancha.toFixed(0)}%**</p>
        </div>

        {/* Feedback del turno anterior */}
        <div className="feedback-box">
          <p>📢 {mensajeFeedback}</p>
        </div>

        {/* SECCIÓN 1: INDICADORES DE LA NASA (A CREAR) */}
        <div className="nasa-data-panel">
          <h3>🛰️ Datos de la NASA para la Zona</h3>
          {datosNASAActuales && (
            <>
              <p>🌱 **Vigor del Cultivo (NDVI):** {datosNASAActuales.NDVI}</p>
              <p>💧 **Humedad del Suelo (SMAP):** {datosNASAActuales.SMAP}</p>
              <p>⛈️ **Riesgo Climático (Rancha):** **{datosNASAActuales.Clima}**</p>
            </>
          )}
        </div>

        {/* SECCIÓN 2: OPCIONES DE DECISIÓN (A CREAR) */}
        {/* Aquí irá el componente con los botones de decisión */}

        {/* ¡Esto es temporal hasta la Fase 3! */}
        <p style={{ marginTop: '20px' }}>*En la siguiente fase, agregaremos aquí los botones de decisión.</p>
      </div>
    </div>
  );
}

export default App;