import React from 'react';
import FooterNav from '../components/FooterNav';
import { Link } from 'react-router-dom';

function SupportGuide() {
  const supportSteps = [
    {
      title: "Monitor Your Fields",
      icon: "👀",
      description: "Regularly inspect your potato fields for early signs of late blight, especially after rain or high humidity."
    },
    {
      title: "Use Resistant Varieties",
      icon: "🥔",
      description: "Plant potato varieties that are resistant to late blight to reduce the risk of infection."
    },
    {
      title: "Proper Spacing",
      icon: "📏",
      description: "Ensure enough space between plants to improve airflow and reduce humidity around foliage."
    },
    {
      title: "Apply Fungicides Strategically",
      icon: "💧",
      description: "Follow local recommendations for fungicide applications to prevent late blight outbreaks."
    },
    {
      title: "Remove Infected Plants",
      icon: "🗑️",
      description: "Immediately remove and destroy infected plants to prevent spread."
    },
    {
      title: "Maintain Clean Tools",
      icon: "🛠️",
      description: "Sanitize tools and machinery after working in infected fields."
    },
    {
      title: "Keep a Field Diary",
      icon: "📒",
      description: "Record all activities, weather conditions, and disease observations to help plan future interventions."
    }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <Link 
          to="/" 
          style={{
            fontSize: '1.8rem',
            textDecoration: 'none',
            position: 'relative',
            zIndex: 10,
            background: 'white',
            borderRadius: '50%',
            padding: '6px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          }}
        >
          🏠
        </Link>

        <h1 style={styles.headerTitle}>
          🐭 Potato Support Guide
        </h1>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        <p style={styles.intro}>
          Here are practical steps to help you mitigate late blight (Phytophthora infestans) and protect your potato crops.
        </p>

        <div style={styles.cardsContainer}>
          {supportSteps.map((step, idx) => (
            <div key={idx} style={styles.card}>
              <div style={styles.cardIcon}>{step.icon}</div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{step.title}</h3>
                <p style={styles.cardDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <FooterNav />
    </div>
  );
}

export default SupportGuide;

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
    fontFamily: "'Inter', sans-serif",
    paddingBottom: '100px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
    position: 'relative'
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.8em',
    fontWeight: '700'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  intro: {
    fontSize: '1.1em',
    color: '#2c3e50',
    marginBottom: '24px'
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    transition: 'transform 0.3s ease',
    cursor: 'default'
  },
  cardIcon: {
    fontSize: '2.5em'
  },
  cardContent: {
    flex: 1
  },
  cardTitle: {
    fontSize: '1.2em',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#2c3e50'
  },
  cardDescription: {
    fontSize: '0.95em',
    color: '#7f8c8d',
    margin: 0,
    lineHeight: '1.5'
  }
};
