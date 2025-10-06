import React, { useState, useEffect } from 'react';
import FooterNav from '../components/FooterNav';
import { FaSeedling, FaRoute, FaGamepad, FaBug, FaChartLine, FaTrophy, FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {
  const [greeting, setGreeting] = useState("");
  const [userName] = useState("Farmer");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("¡Good morning");
    } else if (hour < 19) {
      setGreeting("¡Good afternoon");
    } else {
      setGreeting("¡Good evening");
    }
  }, []);

  const mainFeatures = [
    {
      id: 'recomendaciones',
      title: 'AI Recommendations',
      description: 'Smart Crop Chatbot',
      icon: FaSeedling,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/recommendations',
      badge: 'New'
    },
    {
      id: 'rutas',
      title: 'Support ',
      description: 'Find help nearby',
      icon: FaRoute,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/routes',
      badge: 'Popular'
    },
    {
      id: 'juegos',
      title: 'Mini Game',
      description: 'Learn by playing',
      icon: FaGamepad,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      path: '/minigames',
      badge: 'Fun'
    }
  ];

  const quickAccess = [
    {
      id: 'plagas',
      title: 'Pest Control',
      icon: FaBug,
      path: 'https://cdn.www.gob.pe/uploads/document/file/8771929/7253071-pronosticoplagas031025.pdf?v=1759441767',
      color: '#e74c3c'
    },
    {
      id: 'estadisticas',
      title: 'Statistics',
      icon: FaChartLine,
      path: 'https://www.inei.gob.pe/media/MenuRecursivo/publicaciones_digitales/Est/Lib1912/libro.pdf',
      color: '#3498db'
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
              <span style={styles.userName}>{userName}!👋</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Welcome to <span style={styles.brandName}>Ecoguardian</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Your smart platform for sustainable farmers
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
        <h2 style={styles.sectionTitle}>Explore Our Tools</h2>
        
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
          <h2 style={styles.sectionTitle}>Quick Access</h2>
          <span style={styles.sectionSubtitle}>Your Favorite Tools</span>
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

      {/* Team Section */}
      <section style={{ display: 'flex', justifyContent: 'space-around', padding: '50px 20px', flexWrap: 'wrap', background: '#f9f9f9' }}>
          {[
            {
              name: "Ruben Alexander Sinche Rojas",
              role: "Backend Developer",
              image: "/images/Capibara.jpg",
              linkedin: "https://www.linkedin.com/in/rubensinche/"
            },
            {
              name: "Jelibeth Jimena Ramirez Vilchez",
              role: "Frontend Developer and agro specialist",
              image: "/images/jel.jpg",
              linkedin: "https://www.linkedin.com/in/jelibeth-jimena-ramirez-vilchez-4b24bb2b4/"
            },
            {
              name: "Alexsander Antoni Jayo Mallqui",
              role: "IA analyst",
              image: "/images/jayo.jpg",
              linkedin: "https://www.linkedin.com/in/alexsander-jayo-0b4500362/"
            },
            {
              name: "Richard Favio Asturimac Medina",
              role: "Cloud Developer",
              image: "/images/favio.jpg",
              linkedin: "https://www.linkedin.com/in/favio-asturimac-6b907825b/"
            }
          ].map((member, idx) => (
            <a 
              key={idx}
              href={member.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: '#333',
                width: '200px',
                margin: '20px',
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 15px auto',
                border: '4px solid #667eea'
              }}>
                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ margin: '5px 0', fontSize: '18px', fontWeight: '600' }}>{member.name}</h4>
                <h5 style={{ margin: '2px 0', fontSize: '14px', color: '#666', fontWeight: '400' }}>{member.role}</h5>
              </div>
            </a>
          ))}
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