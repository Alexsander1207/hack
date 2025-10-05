import React, { useState } from 'react';
import FooterNav from '../components/FooterNav';
import { useNavigate } from 'react-router-dom';
import { useParcelContext } from '../context/ParcelContext';
import {
  FaSeedling,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCloudSun,
  FaTemperatureHigh,
  FaTint,
  FaTrash,
  FaSync,
  FaExclamationTriangle,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

function Docs() {
  const navigate = useNavigate();
  const { parcels, deleteParcel } = useParcelContext();
  const [loadingData, setLoadingData] = useState({});
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // Obtener datos climáticos de Open-Meteo (últimos 7 días)
  const fetchWeatherData = async (parcel) => {
    setLoadingData(prev => ({ ...prev, [parcel.id]: true }));
    setPrediction(null);
    setWeatherData(null);

    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - 1); // Ayer
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6); // 7 días atrás

    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    const url = (
      `https://archive-api.open-meteo.com/v1/archive?` +
      `latitude=${parcel.latitude}&longitude=${parcel.longitude}` +
      `&hourly=temperature_2m,relative_humidity_2m,precipitation` +
      `&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}` +
      `&timezone=auto`
    );

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.hourly) {
        // Calcular promedios de 7 días
        const temps = data.hourly.temperature_2m.filter(v => v !== null);
        const humidity = data.hourly.relative_humidity_2m.filter(v => v !== null);
        const precip = data.hourly.precipitation.filter(v => v !== null);

        const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2);
        const avgHumidity = (humidity.reduce((a, b) => a + b, 0) / humidity.length).toFixed(2);
        const totalPrecip = precip.reduce((a, b) => a + b, 0).toFixed(2);

        const processedData = {
          temp_7d: parseFloat(avgTemp),
          hr_7d: parseFloat(avgHumidity),
          ppt_7d: parseFloat(totalPrecip)
        };

        setWeatherData(processedData);
        setSelectedParcel(parcel);

        // Hacer predicción automáticamente
        await makePrediction(parcel, processedData);
      }
    } catch (error) {
      console.error('Error obteniendo datos climáticos:', error);
      alert('Error al obtener datos climáticos. Intenta nuevamente.');
    } finally {
      setLoadingData(prev => ({ ...prev, [parcel.id]: false }));
    }
  };

  // Hacer predicción con tu API
  const makePrediction = async (parcel, weather) => {
    try {
      const requestData = [
            {
            ubicacion: parcel.parcelName,
            temp_7d: weather.temp_7d,
            hr_7d: weather.hr_7d,
            ppt_7d: weather.ppt_7d
        }
      ]
      
      const response = await fetch('https://apicapibara.onrender.com/weather/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      
      if (data && data.length > 0) {
        setPrediction(data[0].prediccion);
      }
    } catch (error) {
      console.error('Error haciendo predicción:', error);
      alert('Error al obtener predicción. Verifica tu conexión.');
    }
  };

  // Eliminar parcela
  const handleDeleteParcel = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta parcela?')) {
      deleteParcel(id);
      if (selectedParcel?.id === id) {
        setSelectedParcel(null);
        setWeatherData(null);
        setPrediction(null);
      }
    }
  };

  const getCropIcon = (cropType) => {
    const icons = {
      papa: '🥔',
      maiz: '🌽',
      quinua: '🌾',
      trigo: '🌾',
      cebada: '🌾',
      habas: '🫘'
    };
    return icons[cropType] || '🌱';
  };

  const getPredictionColor = (pred) => {
    const colors = {
      verde: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
      amarillo: { bg: '#fff3cd', color: '#856404', border: '#ffeeba' },
      naranja: { bg: '#ffe5d0', color: '#d9534f', border: '#ffc107' },
      rojo: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' }
    };
    return colors[pred?.toLowerCase()] || colors.amarillo;
  };

  const getPredictionIcon = (pred) => {
    if (pred?.toLowerCase() === 'verde') return <FaCheckCircle />;
    if (pred?.toLowerCase() === 'rojo') return <FaTimesCircle />;
    return <FaExclamationTriangle />;
  };

  const getPredictionMessage = (pred) => {
    const messages = {
      verde: 'Condiciones óptimas para tu cultivo. ¡Todo está bien!',
      amarillo: 'Condiciones aceptables. Mantén un monitoreo regular.',
      naranja: 'Condiciones de alerta. Se recomienda tomar precauciones.',
      rojo: 'Condiciones críticas. Se requiere acción inmediata.'
    };
    return messages[pred?.toLowerCase()] || 'Predicción en proceso...';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Mis Parcelas</h1>
          <p style={styles.headerSubtitle}>
            {parcels.length} {parcels.length === 1 ? 'parcela registrada' : 'parcelas registradas'}
          </p>
        </div>
        <button 
          style={styles.btnAddNew}
          onClick={() => navigate('/add')}
        >
          <FaPlus style={{ marginRight: '8px' }} />
          Nueva Parcela
        </button>
      </header>

      <main style={styles.main}>
        {parcels.length === 0 ? (
          // Estado vacío
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <FaSeedling size={60} />
            </div>
            <h2 style={styles.emptyTitle}>No tienes parcelas registradas</h2>
            <p style={styles.emptyText}>
              Comienza agregando tu primera parcela para obtener predicciones y recomendaciones
            </p>
            <button 
              style={styles.btnEmptyAction}
              onClick={() => navigate('/add')}
            >
              <FaPlus style={{ marginRight: '8px' }} />
              Agregar Primera Parcela
            </button>
          </div>
        ) : (
          // Lista de parcelas
          <div style={styles.content}>
            {/* Lista de tarjetas */}
            <div style={styles.parcelGrid}>
              {parcels.map((parcel) => (
                <div key={parcel.id} style={styles.parcelCard}>
                  <div style={styles.cardHeader}>
                    <div style={styles.cropBadge}>
                      <span style={styles.cropEmoji}>{getCropIcon(parcel.cropType)}</span>
                      <span style={styles.cropName}>{parcel.cropType}</span>
                    </div>
                    <button
                      style={styles.btnDelete}
                      onClick={() => handleDeleteParcel(parcel.id)}
                      title="Eliminar parcela"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>

                  <h3 style={styles.parcelName}>{parcel.parcelName}</h3>

                  <div style={styles.parcelInfo}>
                    <div style={styles.infoItem}>
                      <FaMapMarkerAlt style={styles.infoIcon} />
                      <span style={styles.infoText}>
                        {parcel.latitude.toFixed(4)}, {parcel.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div style={styles.infoItem}>
                      <FaSeedling style={styles.infoIcon} />
                      <span style={styles.infoText}>{parcel.area} ha</span>
                    </div>
                    {parcel.plantingDate && (
                      <div style={styles.infoItem}>
                        <FaCalendarAlt style={styles.infoIcon} />
                        <span style={styles.infoText}>
                          {new Date(parcel.plantingDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    style={{
                      ...styles.btnGetData,
                      ...(loadingData[parcel.id] ? styles.btnLoading : {})
                    }}
                    onClick={() => fetchWeatherData(parcel)}
                    disabled={loadingData[parcel.id]}
                  >
                    {loadingData[parcel.id] ? (
                      <>
                        <FaSync className="spinning" style={{ marginRight: '8px' }} />
                        Analizando...
                      </>
                    ) : (
                      <>
                        <FaCloudSun style={{ marginRight: '8px' }} />
                        Obtener Predicción
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Panel de resultados */}
            {weatherData && selectedParcel && (
              <div style={styles.resultsPanel}>
                <div style={styles.resultsPanelHeader}>
                  <h3 style={styles.resultsTitle}>
                    <FaCloudSun style={{ marginRight: '10px' }} />
                    Análisis de {selectedParcel.parcelName}
                  </h3>
                  <p style={styles.resultsSubtitle}>
                    Datos climáticos de los últimos 7 días
                  </p>
                </div>

                {/* Datos climáticos */}
                <div style={styles.dataGrid}>
                  <div style={styles.dataCard}>
                    <div style={{...styles.dataIcon, background: '#ff6b6b20', color: '#ff6b6b'}}>
                      <FaTemperatureHigh size={24} />
                    </div>
                    <div style={styles.dataContent}>
                      <span style={styles.dataLabel}>Temperatura Promedio</span>
                      <span style={styles.dataValue}>{weatherData.temp_7d}°C</span>
                    </div>
                  </div>

                  <div style={styles.dataCard}>
                    <div style={{...styles.dataIcon, background: '#4ecdc420', color: '#4ecdc4'}}>
                      <FaTint size={24} />
                    </div>
                    <div style={styles.dataContent}>
                      <span style={styles.dataLabel}>Humedad Promedio</span>
                      <span style={styles.dataValue}>{weatherData.hr_7d}%</span>
                    </div>
                  </div>

                  <div style={styles.dataCard}>
                    <div style={{...styles.dataIcon, background: '#95e1d320', color: '#95e1d3'}}>
                      <FaTint size={24} />
                    </div>
                    <div style={styles.dataContent}>
                      <span style={styles.dataLabel}>Precipitación Total</span>
                      <span style={styles.dataValue}>{weatherData.ppt_7d} mm</span>
                    </div>
                  </div>
                </div>

                {/* Resultado de predicción */}
                {prediction && (
                  <div 
                    style={{
                      ...styles.predictionBox,
                      background: getPredictionColor(prediction).bg,
                      borderLeft: `4px solid ${getPredictionColor(prediction).border}`
                    }}
                  >
                    <div style={{
                      ...styles.predictionIcon,
                      color: getPredictionColor(prediction).color
                    }}>
                      {getPredictionIcon(prediction)}
                    </div>
                    <div style={styles.predictionContent}>
                      <h4 style={{
                        ...styles.predictionTitle,
                        color: getPredictionColor(prediction).color
                      }}>
                        Estado: {prediction.toUpperCase()}
                      </h4>
                      <p style={{
                        ...styles.predictionMessage,
                        color: getPredictionColor(prediction).color
                      }}>
                        {getPredictionMessage(prediction)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <FooterNav />     
    </div>
  );
}

export default Docs;

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
    paddingBottom: '100px',
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px 20px',
    color: 'white',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  headerContent: {
    flex: 1
  },
  headerTitle: {
    fontSize: '1.8em',
    fontWeight: '700',
    margin: 0,
    marginBottom: '4px'
  },
  headerSubtitle: {
    fontSize: '0.95em',
    opacity: 0.9,
    margin: 0
  },
  btnAddNew: {
    background: 'white',
    color: '#667eea',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    maxWidth: '500px',
    margin: '0 auto'
  },
  emptyIcon: {
    color: '#667eea',
    marginBottom: '24px'
  },
  emptyTitle: {
    fontSize: '1.8em',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '12px'
  },
  emptyText: {
    fontSize: '1.05em',
    color: '#7f8c8d',
    marginBottom: '32px',
    lineHeight: '1.6'
  },
  btnEmptyAction: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '1.1em',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
  },
  content: {
    display: 'grid',
    gap: '24px'
  },
  parcelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  parcelCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  cropBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    padding: '8px 12px',
    borderRadius: '10px'
  },
  cropEmoji: {
    fontSize: '1.5em'
  },
  cropName: {
    fontSize: '0.9em',
    fontWeight: '600',
    color: '#667eea',
    textTransform: 'capitalize'
  },
  btnDelete: {
    background: '#fee2e2',
    color: '#e74c3c',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  },
  parcelName: {
    fontSize: '1.4em',
    fontWeight: '700',
    color: '#2c3e50',
    margin: 0,
    marginBottom: '16px'
  },
  parcelInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '16px'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  infoIcon: {
    color: '#667eea',
    fontSize: '0.9em'
  },
  infoText: {
    fontSize: '0.9em',
    color: '#7f8c8d'
  },
  btnGetData: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95em',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  },
  btnLoading: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  resultsPanel: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
  },
  resultsPanelHeader: {
    marginBottom: '24px'
  },
  resultsTitle: {
    fontSize: '1.6em',
    fontWeight: '700',
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    marginBottom: '8px'
  },
  resultsSubtitle: {
    fontSize: '0.95em',
    color: '#7f8c8d',
    margin: 0
  },
  dataGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  dataCard: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  dataIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  dataContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  dataLabel: {
    fontSize: '0.85em',
    color: '#7f8c8d',
    fontWeight: '500'
  },
  dataValue: {
    fontSize: '1.4em',
    fontWeight: '700',
    color: '#2c3e50'
  },
  predictionBox: {
    padding: '24px',
    borderRadius: '12px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  },
  predictionIcon: {
    fontSize: '2.5em',
    flexShrink: 0
  },
  predictionContent: {
    flex: 1
  },
  predictionTitle: {
    fontSize: '1.3em',
    fontWeight: '700',
    marginBottom: '8px',
    margin: 0,
  },
  predictionMessage: {
    fontSize: '1em',
    lineHeight: '1.6',
    margin: 0
  }
};

// Agregar animación de spinning
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spinning {
    animation: spin 1s linear infinite;
  }
`;
if (!document.getElementById('docsStyles')) {
  styleSheet.id = 'docsStyles';
  document.head.appendChild(styleSheet);
}