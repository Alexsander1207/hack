import React, { useState } from 'react';
import FooterNav from '../components/FooterNav';
import { useNavigate } from 'react-router-dom';
import { useParcelContext } from '../context/ParcelContext';
import { 
  FaMapMarkerAlt, 
  FaSeedling, 
  FaCloudSun, 
  FaRuler,
  FaCalendarAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaCrosshairs
} from 'react-icons/fa';

function AddParcel() {
  const navigate = useNavigate();
  const { addParcel } = useParcelContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    parcelName: '',
    cropType: '',
    area: '',
    plantingDate: '',
    latitude: -12.0464, // Huancayo, Perú
    longitude: -75.2042,
    altitude: 3271,
    soilType: '',
    irrigationType: ''
  });
  const [isLocating, setIsLocating] = useState(false);

  const cropTypes = [
    { value: 'papa', label: '🥔 Papa', icon: '🥔' },
    { value: 'maiz', label: '🌽 Maíz', icon: '🌽' },
    { value: 'quinua', label: '🌾 Quinua', icon: '🌾' },
    { value: 'trigo', label: '🌾 Trigo', icon: '🌾' },
    { value: 'cebada', label: '🌾 Cebada', icon: '🌾' },
    { value: 'habas', label: '🫘 Habas', icon: '🫘' }
  ];

  const soilTypes = [
    { value: 'arcilloso', label: 'Arcilloso' },
    { value: 'arenoso', label: 'Arenoso' },
    { value: 'limoso', label: 'Limoso' },
    { value: 'franco', label: 'Franco' }
  ];

  const irrigationTypes = [
    { value: 'goteo', label: 'Riego por Goteo' },
    { value: 'aspersion', label: 'Riego por Aspersión' },
    { value: 'gravedad', label: 'Riego por Gravedad' },
    { value: 'lluvia', label: 'Solo Lluvia' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setIsLocating(false);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          alert('No se pudo obtener tu ubicación. Verifica los permisos.');
          setIsLocating(false);
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización');
      setIsLocating(false);
    }
  };

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simular coordenadas (en producción, usarías la API del mapa)
    const lat = formData.latitude + (y - rect.height / 2) * 0.0001;
    const lng = formData.longitude + (x - rect.width / 2) * 0.0001;
    
    setFormData(prev => ({
      ...prev,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6))
    }));
  };

  const handleSubmit = () => {
    // Validaciones
    if (!formData.parcelName || !formData.cropType || !formData.area) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    // Guardar parcela en el Context
    const savedParcel = addParcel(formData);
    console.log('Parcela registrada:', savedParcel);
    
    // Mostrar paso de éxito
    setStep(4);
  };

  const renderStep1 = () => (
    <div style={styles.stepContainer}>
      <div style={styles.stepHeader}>
        <div style={styles.stepIcon}>
          <FaSeedling size={32} />
        </div>
        <h2 style={styles.stepTitle}>Información Básica</h2>
        <p style={styles.stepSubtitle}>Cuéntanos sobre tu parcela</p>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          <FaSeedling style={styles.labelIcon} />
          Nombre de la Parcela *
        </label>
        <input
          type="text"
          style={styles.input}
          placeholder="Ej: Parcela Norte, Lote 1"
          value={formData.parcelName}
          onChange={(e) => handleInputChange('parcelName', e.target.value)}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          <FaSeedling style={styles.labelIcon} />
          Tipo de Cultivo *
        </label>
        <div style={styles.cropGrid}>
          {cropTypes.map(crop => (
            <div
              key={crop.value}
              style={{
                ...styles.cropCard,
                ...(formData.cropType === crop.value ? styles.cropCardActive : {})
              }}
              onClick={() => handleInputChange('cropType', crop.value)}
            >
              <span style={styles.cropIcon}>{crop.icon}</span>
              <span style={styles.cropLabel}>{crop.label.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <FaRuler style={styles.labelIcon} />
            Área (hectáreas) *
          </label>
          <input
            type="number"
            style={styles.input}
            placeholder="2.5"
            step="0.1"
            value={formData.area}
            onChange={(e) => handleInputChange('area', e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            <FaCalendarAlt style={styles.labelIcon} />
            Fecha de Siembra
          </label>
          <input
            type="date"
            style={styles.input}
            value={formData.plantingDate}
            onChange={(e) => handleInputChange('plantingDate', e.target.value)}
          />
        </div>
      </div>

      <button style={styles.btnNext} onClick={() => setStep(2)}>
        Siguiente: Ubicación
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div style={styles.stepContainer}>
      <div style={styles.stepHeader}>
        <div style={styles.stepIcon}>
          <FaMapMarkerAlt size={32} />
        </div>
        <h2 style={styles.stepTitle}>Ubicación de la Parcela</h2>
        <p style={styles.stepSubtitle}>Selecciona la ubicación exacta</p>
      </div>

      <div style={styles.locationInfo}>
        <FaInfoCircle style={styles.infoIcon} />
        <p style={styles.infoText}>
          Toca en el mapa para seleccionar la ubicación o usa tu ubicación actual
        </p>
      </div>

      <button 
        style={styles.btnLocation} 
        onClick={getCurrentLocation}
        disabled={isLocating}
      >
        <FaCrosshairs style={{ marginRight: '8px' }} />
        {isLocating ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
      </button>

      <div style={styles.mapContainer} onClick={handleMapClick}>
        <div style={styles.mapOverlay}>
          <div style={styles.mapMarker}>
            <FaMapMarkerAlt size={40} color="#e74c3c" />
          </div>
          <div style={styles.mapGrid} />
        </div>
        <img 
          src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${formData.longitude},${formData.latitude},13,0/600x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`}
          alt="Mapa"
          style={styles.mapImage}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          }}
        />
      </div>

      <div style={styles.coordinatesBox}>
        <div style={styles.coordItem}>
          <span style={styles.coordLabel}>Latitud:</span>
          <span style={styles.coordValue}>{formData.latitude.toFixed(6)}</span>
        </div>
        <div style={styles.coordItem}>
          <span style={styles.coordLabel}>Longitud:</span>
          <span style={styles.coordValue}>{formData.longitude.toFixed(6)}</span>
        </div>
        <div style={styles.coordItem}>
          <span style={styles.coordLabel}>Altitud:</span>
          <span style={styles.coordValue}>{formData.altitude} m</span>
        </div>
      </div>

      <div style={styles.btnGroup}>
        <button style={styles.btnBack} onClick={() => setStep(1)}>
          Atrás
        </button>
        <button style={styles.btnNext} onClick={() => setStep(3)}>
          Siguiente: Detalles
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={styles.stepContainer}>
      <div style={styles.stepHeader}>
        <div style={styles.stepIcon}>
          <FaCloudSun size={32} />
        </div>
        <h2 style={styles.stepTitle}>Detalles Adicionales</h2>
        <p style={styles.stepSubtitle}>Información para mejores predicciones</p>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Tipo de Suelo</label>
        <select
          style={styles.select}
          value={formData.soilType}
          onChange={(e) => handleInputChange('soilType', e.target.value)}
        >
          <option value="">Selecciona un tipo</option>
          {soilTypes.map(soil => (
            <option key={soil.value} value={soil.value}>{soil.label}</option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Sistema de Riego</label>
        <div style={styles.radioGroup}>
          {irrigationTypes.map(irrigation => (
            <label key={irrigation.value} style={styles.radioLabel}>
              <input
                type="radio"
                name="irrigation"
                value={irrigation.value}
                checked={formData.irrigationType === irrigation.value}
                onChange={(e) => handleInputChange('irrigationType', e.target.value)}
                style={styles.radio}
              />
              <span>{irrigation.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={styles.summaryBox}>
        <h3 style={styles.summaryTitle}>Resumen de tu Parcela</h3>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Nombre:</span>
            <span style={styles.summaryValue}>{formData.parcelName || '-'}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Cultivo:</span>
            <span style={styles.summaryValue}>
              {cropTypes.find(c => c.value === formData.cropType)?.label || '-'}
            </span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Área:</span>
            <span style={styles.summaryValue}>{formData.area || '-'} ha</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Ubicación:</span>
            <span style={styles.summaryValue}>
              {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.btnGroup}>
        <button style={styles.btnBack} onClick={() => setStep(2)}>
          Atrás
        </button>
        <button style={styles.btnSubmit} onClick={handleSubmit}>
          <FaCheckCircle style={{ marginRight: '8px' }} />
          Registrar Parcela
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={styles.successContainer}>
      <div style={styles.successIcon}>
        <FaCheckCircle size={80} />
      </div>
      <h2 style={styles.successTitle}>¡Parcela Registrada!</h2>
      <p style={styles.successText}>
        Tu parcela <strong>{formData.parcelName}</strong> ha sido registrada exitosamente.
      </p>
      <p style={styles.successSubtext}>
        Ahora puedes obtener predicciones y recomendaciones para tu cultivo de {cropTypes.find(c => c.value === formData.cropType)?.label}
      </p>
      
      <div style={styles.successActions}>
        <button style={styles.btnPrimary} onClick={() => navigate('/docs')}>
          Ver Mis Parcelas
        </button>
        <button style={styles.btnSecondary} onClick={() => {
          setStep(1);
          setFormData({
            parcelName: '',
            cropType: '',
            area: '',
            plantingDate: '',
            latitude: -12.0464,
            longitude: -75.2042,
            altitude: 3271,
            soilType: '',
            irrigationType: ''
          });
        }}>
          Agregar Otra Parcela
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Agregar Parcela</h1>
        <div style={styles.progressBar}>
          {[1, 2, 3].map(num => (
            <div
              key={num}
              style={{
                ...styles.progressDot,
                ...(step >= num ? styles.progressDotActive : {})
              }}
            />
          ))}
        </div>
      </header>

      <main style={styles.main}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </main>

      <FooterNav />
    </div>
  );
}

export default AddParcel;

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
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
  },
  headerTitle: {
    fontSize: '1.8em',
    fontWeight: '700',
    marginBottom: '16px',
    textAlign: 'center'
  },
  progressBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '16px'
  },
  progressDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease'
  },
  progressDotActive: {
    background: 'white',
    width: '40px',
    borderRadius: '6px'
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  },
  stepContainer: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
  },
  stepHeader: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  stepIcon: {
    width: '80px',
    height: '80px',
    margin: '0 auto 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  stepTitle: {
    fontSize: '1.8em',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '8px'
  },
  stepSubtitle: {
    fontSize: '1em',
    color: '#7f8c8d'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1em',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px'
  },
  labelIcon: {
    color: '#667eea'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '1em',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit'
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '1em',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    background: 'white',
    cursor: 'pointer'
  },
  cropGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  cropCard: {
    padding: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'white'
  },
  cropCardActive: {
    border: '2px solid #667eea',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    transform: 'scale(1.05)'
  },
  cropIcon: {
    fontSize: '2em',
    display: 'block',
    marginBottom: '8px'
  },
  cropLabel: {
    fontSize: '0.9em',
    fontWeight: '600',
    color: '#2c3e50'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  locationInfo: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '20px'
  },
  infoIcon: {
    color: '#667eea',
    fontSize: '1.5em',
    flexShrink: 0
  },
  infoText: {
    fontSize: '0.9em',
    color: '#2c3e50',
    margin: 0
  },
  btnLocation: {
    width: '100%',
    padding: '14px',
    background: 'white',
    border: '2px solid #667eea',
    color: '#667eea',
    borderRadius: '12px',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    marginBottom: '20px'
  },
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: '400px',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '20px',
    cursor: 'crosshair',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 2
  },
  mapMarker: {
    animation: 'bounce 2s ease-in-out infinite',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    opacity: 0.5
  },
  mapImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  coordinatesBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '24px'
  },
  coordItem: {
    background: '#f8f9fa',
    padding: '12px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  coordLabel: {
    fontSize: '0.8em',
    color: '#7f8c8d',
    fontWeight: '500'
  },
  coordValue: {
    fontSize: '1em',
    fontWeight: '700',
    color: '#2c3e50'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  radio: {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  summaryBox: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    padding: '24px',
    borderRadius: '16px',
    marginBottom: '24px'
  },
  summaryTitle: {
    fontSize: '1.2em',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '16px'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  summaryLabel: {
    fontSize: '0.85em',
    color: '#7f8c8d',
    fontWeight: '500'
  },
  summaryValue: {
    fontSize: '1em',
    fontWeight: '600',
    color: '#2c3e50'
  },
  btnGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '12px',
    marginTop: '24px'
  },
  btnBack: {
    padding: '14px',
    background: 'white',
    border: '2px solid #e0e0e0',
    color: '#2c3e50',
    borderRadius: '12px',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  btnNext: {
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    color: 'white',
    borderRadius: '12px',
    fontSize: '1.1em',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
  },
  btnSubmit: {
    padding: '16px',
    background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
    border: 'none',
    color: 'white',
    borderRadius: '12px',
    fontSize: '1.1em',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(39, 174, 96, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successContainer: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  successIcon: {
    color: '#27ae60',
    marginBottom: '24px',
    animation: 'scaleIn 0.5s ease'
  },
  successTitle: {
    fontSize: '2em',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '16px'
  },
  successText: {
    fontSize: '1.1em',
    color: '#7f8c8d',
    marginBottom: '12px'
  },
  successSubtext: {
    fontSize: '0.95em',
    color: '#95a5a6',
    marginBottom: '32px'
  },
  successActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '400px',
    margin: '0 auto'
  },
  btnPrimary: {
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    color: 'white',
    borderRadius: '12px',
    fontSize: '1.1em',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  btnSecondary: {
    padding: '14px',
    background: 'white',
    border: '2px solid #667eea',
    color: '#667eea',
    borderRadius: '12px',
    fontSize: '1em',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

// Animaciones CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  input:focus, select:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
  
  .cropCard:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.2) !important;
  }
  
  button:hover {
    transform: translateY(-2px) !important;
  }
  
  button:active {
    transform: translateY(0) !important;
  }
`;
if (!document.getElementById('addParcelStyles')) {
  styleSheet.id = 'addParcelStyles';
  document.head.appendChild(styleSheet);
}