import React, { useState, useEffect } from 'react';
import FooterNav from '../components/FooterNav';
import { FaSeedling, FaRoute, FaGamepad, FaBug, FaChartLine, FaTrophy, FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {
  const [greeting, setGreeting] = useState("");
  const [userName] = useState("Agricultor");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("¡Buenos días");
    } else if (hour < 19) {
      setGreeting("¡Buenas tardes");
    } else {
      setGreeting("¡Buenas noches");
    }
  }, []);

  const mainFeatures = [
    {
      id: 'recomendaciones',
      title: 'Recomendaciones IA',
      description: 'Sistema inteligente de cultivos',
      icon: FaSeedling,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/recommendations',
      badge: 'Nuevo'
    },
    {
      id: 'rutas',
      title: 'Rutas de Apoyo',
      description: 'Encuentra ayuda cercana',
      icon: FaRoute,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/routes',
      badge: 'Popular'
    },
    {
      id: 'juegos',
      title: 'Mini Juegos',
      description: 'Aprende jugando',
      icon: FaGamepad,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      path: '/minigames',
      badge: 'Divertido'
    }
  ];

  const quickAccess = [
    {
      id: 'plagas',
      title: 'Control Plagas',
      icon: FaBug,
      path: '/pest-control',
      color: '#e74c3c'
    },
    {
      id: 'estadisticas',
      title: 'Estadísticas',
      icon: FaChartLine,
      path: '/stats',
      color: '#3498db'
    },
    {
      id: 'logros',
      title: 'Mis Logros',
      icon: FaTrophy,
      path: '/achievements',
      color: '#f39c12'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Header Mejorado */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.greeting}>
            <div style={styles.greetingIcon}>
              <FaSeedling size={24} />
            </div>
            <div style={styles.greetingText}>
              <span style={styles.greetingTime}>{greeting}</span>
              <span style={styles.userName}>{userName} 👋</span>
            </div>
          </div>
          <div style={styles.headerBadge}>
            <FaBook size={16} style={{ marginRight: '6px' }} />
            <span>Nivel 5</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Bienvenido a <span style={styles.brandName}>Ecoguardian</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Tu asistente inteligente para agricultura sostenible
          </p>
          
          <div style={styles.heroImageContainer}>
            <div style={styles.imageGlow} />
            <img 
              src="/images/papa.jpg" 
              alt="Papa" 
              style={styles.heroImage}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div style="width: 200px; height: 200px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 80px;">🌱</div>';
              }}
            />
          </div>
        </div>
      </section>

      {/* Main Features Cards */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Explora Nuestras Herramientas</h2>
        
        <div style={styles.mainCardsGrid}>
          {mainFeatures.map((feature) => {
            const Icon = feature.icon;
            const isHovered = hoveredCard === feature.id;
            
            return (
              <Link 
                key={feature.id}
                to={feature.path} 
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    ...styles.mainCard,
                    background: feature.gradient,
                    transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: isHovered 
                      ? '0 20px 40px rgba(102, 126, 234, 0.35)'
                      : '0 8px 20px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseEnter={() => setHoveredCard(feature.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {feature.badge && (
                    <div style={styles.cardBadge}>
                      {feature.badge}
                    </div>
                  )}
                  
                  <div style={styles.cardIcon}>
                    <Icon size={48} />
                  </div>
                  
                  <h3 style={styles.cardTitle}>{feature.title}</h3>
                  <p style={styles.cardDescription}>{feature.description}</p>
                  
                  <div style={styles.cardArrow}>
                    →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Access Section */}
      <section style={styles.quickAccessSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Acceso Rápido</h2>
          <span style={styles.sectionSubtitle}>Tus herramientas favoritas</span>
        </div>
        
        <div style={styles.quickGrid}>
          {quickAccess.map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredCard === item.id;
            
            return (
              <Link 
                key={item.id}
                to={item.path}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    ...styles.quickCard,
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isHovered
                      ? `0 8px 24px ${item.color}40`
                      : '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div 
                    style={{
                      ...styles.quickIcon,
                      background: `${item.color}20`,
                      color: item.color
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <span style={styles.quickTitle}>{item.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats Banner */}
      <section style={styles.statsBanner}>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>125</span>
          <span style={styles.statLabel}>Cultivos</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNumber}>48</span>
          <span style={styles.statLabel}>Días activo</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statNumber}>92%</span>
          <span style={styles.statLabel}>Éxito</span>
        </div>
      </section>

      <FooterNav />
    </div>
  );
}

export default Home;

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
    paddingBottom: '100px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },

  // HEADER STYLES
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 999
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  greeting: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  greetingIcon: {
    width: '48px',
    height: '48px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backdropFilter: 'blur(10px)'
  },
  greetingText: {
    display: 'flex',
    flexDirection: 'column',
    color: 'white'
  },
  greetingTime: {
    fontSize: '0.9em',
    opacity: 0.9,
    fontWeight: '400'
  },
  userName: {
    fontSize: '1.3em',
    fontWeight: '700'
  },
  headerBadge: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    padding: '8px 16px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.9em',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center'
  },

  // HERO SECTION
  heroSection: {
    padding: '40px 20px',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '2.5em',
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: '12px',
    lineHeight: '1.2'
  },
  brandName: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSubtitle: {
    fontSize: '1.1em',
    color: '#7f8c8d',
    marginBottom: '30px',
    fontWeight: '400'
  },
  heroImageContainer: {
    position: 'relative',
    display: 'inline-block',
    marginTop: '20px'
  },
  imageGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '240px',
    height: '240px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.3,
    animation: 'pulse 3s ease-in-out infinite'
  },
  heroImage: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '6px solid white',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
    position: 'relative',
    zIndex: 1
  },

  // FEATURES SECTION
  featuresSection: {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '1.8em',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '24px',
    textAlign: 'center'
  },
  mainCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '30px'
  },
  mainCard: {
    position: 'relative',
    padding: '32px',
    borderRadius: '20px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    minHeight: '240px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '0.75em',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  cardIcon: {
    width: '80px',
    height: '80px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.3)'
  },
  cardTitle: {
    fontSize: '1.5em',
    fontWeight: '700',
    marginBottom: '8px',
    margin: 0
  },
  cardDescription: {
    fontSize: '0.95em',
    opacity: 0.9,
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  cardArrow: {
    fontSize: '2em',
    fontWeight: '700',
    textAlign: 'right',
    opacity: 0.7
  },

  // QUICK ACCESS
  quickAccessSection: {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionHeader: {
    marginBottom: '24px'
  },
  sectionSubtitle: {
    display: 'block',
    fontSize: '0.95em',
    color: '#7f8c8d',
    marginTop: '8px'
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px'
  },
  quickCard: {
    background: 'white',
    padding: '24px 16px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  quickIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickTitle: {
    fontSize: '0.9em',
    fontWeight: '600',
    color: '#2c3e50'
  },

  // STATS BANNER
  statsBanner: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '32px 20px',
    margin: '40px 20px',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
    maxWidth: '1160px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  statNumber: {
    fontSize: '2.5em',
    fontWeight: '800',
    lineHeight: '1'
  },
  statLabel: {
    fontSize: '0.9em',
    opacity: 0.9,
    fontWeight: '500'
  },
  statDivider: {
    width: '2px',
    height: '60px',
    background: 'rgba(255, 255, 255, 0.2)'
  }
};

// Inyectar animaciones
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
  }
`;
document.head.appendChild(styleSheet);