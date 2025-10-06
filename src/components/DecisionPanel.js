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
        titulo: 'Light Irrigation',
        descripcion: 'Efficient for dry soils',
        impacto: '+Performance | Sustainable',
        color: '#3498db'
      },
      {
        valor: 'abundante',
        icono: '🌊',
        titulo: 'Abundant',
        descripcion: 'Intensive use of water',
        impacto: '++Performance | -Sustainability',
        color: '#e74c3c'
      },
      {
        valor: 'no_regar',
        icono: '🚫',
        titulo: 'Do not water',
        descripcion: 'Save water',
        impacto: 'Neutral | ++Sustainable',
        color: '#95a5a6'
      }
    ],
    fertilizacion: [
      {
        valor: 'organico',
        icono: '🌱',
        titulo: 'Organic',
        descripcion: 'Improves the soil long term',
        impacto: '+Performance | +Sustainability',
        color: '#27ae60'
      },
      {
        valor: 'quimico',
        icono: '⚗️',
        titulo: 'Chemical',
        descripcion: 'Quick results',
        impacto: '++Performance | --Sustainability',
        color: '#e67e22'
      },
      {
        valor: 'no_fertilizar',
        icono: '⏸️',
        titulo: 'Do not Fertilize',
        descripcion: 'Rest the ground',
        impacto: 'Neutral',
        color: '#95a5a6'
      }
    ],
    proteccion: [
      {
        valor: 'biologico',
        icono: '🛡️',
        titulo: 'Biological',
        descripcion: 'natural control',
        impacto: '-Rancha | +Sustainability',
        color: '#16a085'
      },
      {
        valor: 'quimico',
        icono: '💊',
        titulo: 'Chemical',
        descripcion: 'Aggressive removal',
        impacto: '--Rancha | -Sustainability',
        color: '#c0392b'
      },
      {
        valor: 'esperar',
        icono: '⏳',
        titulo: 'Wait',
        descripcion: 'Observe evolution',
        impacto: 'Risk if weather HIGH',
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
        🎯 Choose your Action as an EcoGuardian
      </h3>

      {/* RIEGO */}
      <div className="decision-category">
        <h4 className="category-header">
          💧 Irrigation Management
          {datosNASA && <span className="category-hint">(Guide: SMAP - {datosNASA.SMAP})</span>}
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
          🌱 Nutrient Management
          {datosNASA && <span className="category-hint">(Guide: NDVI - {datosNASA.NDVI})</span>}
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
          🛡️ Pest Management
          {datosNASA && <span className="category-hint">(Climate: Clima - {datosNASA.Clima})</span>}
        </h4>
        <div className="botones-grid">
          {opciones.proteccion.map(opcion => (
            <BotonDecision key={opcion.valor} tipo="proteccion" opcion={opcion} />
          ))}
        </div>
      </div>

      <div className="decision-tip">
        💡 <strong>Tip:</strong> Options marked with ⭐ are recommended based on NASA data
      </div>
    </div>
  );
};

export default DecisionPanel;