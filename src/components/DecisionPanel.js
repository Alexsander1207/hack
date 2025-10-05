// src/components/DecisionPanel.js
import React, { useState } from 'react';
import './DecisionPanel.css';

const DecisionPanel = ({ manejarDecision, datosNASA, bloqueado }) => {
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [accionSeleccionada, setAccionSeleccionada] = useState(null);

  const handleClick = (tipo, valor) => {
    if (bloqueado) return;
    setAccionSeleccionada(`${tipo}-${valor}`);
    setTimeout(() => {
      manejarDecision(tipo, valor);
      setAccionSeleccionada(null);
    }, 300);
  };

  // Sistema de recomendaciones inteligentes
  const getRecomendacion = (tipo) => {
    if (!datosNASA) return null;
    
    if (tipo === 'riego') {
      if (datosNASA.SMAP === 'MUY SECO') return 'abundante';
      if (datosNASA.SMAP === 'Seco') return 'ligero';
      if (datosNASA.SMAP === 'Saturado') return 'no_regar';
      return 'ligero';
    }
    if (tipo === 'fertilizacion') {
      if (datosNASA.NDVI === 'Bajo') return 'organico';
      if (datosNASA.NDVI === 'Muy Alto') return 'no_fertilizar';
      return 'organico';
    }
    if (tipo === 'proteccion') {
      if (datosNASA.Clima === 'ALTO') return 'biologico';
      return 'esperar';
    }
  };

  const opciones = {
    riego: [
      {
        valor: 'ligero',
        icono: '💧',
        titulo: 'Riego Ligero',
        descripcion: 'Eficiente para suelos secos',
        impacto: '+Rendimiento | Sostenible',
        color: '#3498db'
      },
      {
        valor: 'abundante',
        icono: '🌊',
        titulo: 'Abundante',
        descripcion: 'Uso intensivo de agua',
        impacto: '++Rendimiento | -Sostenibilidad',
        color: '#e74c3c'
      },
      {
        valor: 'no_regar',
        icono: '🚫',
        titulo: 'No Regar',
        descripcion: 'Ahorra agua',
        impacto: 'Neutral | ++Sostenible',
        color: '#95a5a6'
      }
    ],
    fertilizacion: [
      {
        valor: 'organico',
        icono: '🌱',
        titulo: 'Orgánico',
        descripcion: 'Mejora el suelo largo plazo',
        impacto: '+Rendimiento | +Sostenibilidad',
        color: '#27ae60'
      },
      {
        valor: 'quimico',
        icono: '⚗️',
        titulo: 'Químico',
        descripcion: 'Resultados rápidos',
        impacto: '++Rendimiento | --Sostenibilidad',
        color: '#e67e22'
      },
      {
        valor: 'no_fertilizar',
        icono: '⏸️',
        titulo: 'No Fertilizar',
        descripcion: 'Descansar el suelo',
        impacto: 'Neutral',
        color: '#95a5a6'
      }
    ],
    proteccion: [
      {
        valor: 'biologico',
        icono: '🛡️',
        titulo: 'Biológico',
        descripcion: 'Control natural',
        impacto: '-Rancha | +Sostenibilidad',
        color: '#16a085'
      },
      {
        valor: 'quimico',
        icono: '💊',
        titulo: 'Químico',
        descripcion: 'Eliminación agresiva',
        impacto: '--Rancha | -Sostenibilidad',
        color: '#c0392b'
      },
      {
        valor: 'esperar',
        icono: '⏳',
        titulo: 'Esperar',
        descripcion: 'Observar evolución',
        impacto: 'Riesgo si clima ALTO',
        color: '#f39c12'
      }
    ]
  };

  const BotonDecision = ({ tipo, opcion }) => {
    const esRecomendado = getRecomendacion(tipo) === opcion.valor;
    const estaSeleccionado = accionSeleccionada === `${tipo}-${opcion.valor}`;

    return (
      <div className="boton-wrapper">
        <button
          className={`btn-decision ${esRecomendado ? 'recomendado' : ''} ${estaSeleccionado ? 'seleccionado' : ''}`}
          onClick={() => handleClick(tipo, opcion.valor)}
          disabled={bloqueado}
          onMouseEnter={() => setTooltipVisible(`${tipo}-${opcion.valor}`)}
          onMouseLeave={() => setTooltipVisible(null)}
          style={{ 
            backgroundColor: estaSeleccionado ? '#2c3e50' : opcion.color,
            opacity: bloqueado ? 0.5 : 1,
            cursor: bloqueado ? 'not-allowed' : 'pointer'
          }}
        >
          <div className="btn-icon">{opcion.icono}</div>
          <div className="btn-titulo">{opcion.titulo}</div>
          {esRecomendado && <div className="estrella-badge">⭐</div>}
        </button>

        {tooltipVisible === `${tipo}-${opcion.valor}` && (
          <div className="tooltip">
            <div className="tooltip-desc">{opcion.descripcion}</div>
            <div className="tooltip-impacto">{opcion.impacto}</div>
            <div className="tooltip-arrow"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="decision-panel">
      <h3 className="decision-title">
        🎯 Elige tu Acción como EcoGuardián
      </h3>

      {/* RIEGO */}
      <div className="decision-category">
        <h4 className="category-header">
          💧 Gestión del Riego 
          {datosNASA && <span className="category-hint">(Guía: SMAP - {datosNASA.SMAP})</span>}
        </h4>
        <div className="botones-grid">
          {opciones.riego.map(opcion => (
            <BotonDecision key={opcion.valor} tipo="riego" opcion={opcion} />
          ))}
        </div>
      </div>

      {/* FERTILIZACIÓN */}
      <div className="decision-category">
        <h4 className="category-header">
          🌱 Gestión de Nutrientes
          {datosNASA && <span className="category-hint">(Guía: NDVI - {datosNASA.NDVI})</span>}
        </h4>
        <div className="botones-grid">
          {opciones.fertilizacion.map(opcion => (
            <BotonDecision key={opcion.valor} tipo="fertilizacion" opcion={opcion} />
          ))}
        </div>
      </div>

      {/* PROTECCIÓN */}
      <div className="decision-category">
        <h4 className="category-header">
          🛡️ Gestión de Plagas
          {datosNASA && <span className="category-hint">(Guía: Clima - {datosNASA.Clima})</span>}
        </h4>
        <div className="botones-grid">
          {opciones.proteccion.map(opcion => (
            <BotonDecision key={opcion.valor} tipo="proteccion" opcion={opcion} />
          ))}
        </div>
      </div>

      <div className="decision-tip">
        💡 <strong>Consejo:</strong> Las opciones con ⭐ son recomendadas según los datos NASA
      </div>
    </div>
  );
};

export default DecisionPanel;