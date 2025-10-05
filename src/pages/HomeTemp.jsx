import React, { useState, useEffect } from 'react';
import FooterNav from '../components/FooterNav';
import { FaSeedling, FaRoute, FaGamepad } from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("¡Buenos días,");
    } else if (hour < 19) {
      setGreeting("¡Buenas tardes,");
    } else {
      setGreeting("¡Buenas noches,");
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.greeting}>
          <FaSeedling style={{ color: "#2e7d32", marginRight: "8px" }} />
          {greeting}&nbsp;<b>Agricultor</b> 👋
        </div>
      </header>

      {/* Bienvenida */}
      <section style={styles.parcela}>
        <h2 style={styles.title}>
          Bienvenido a <span style={{ color: "#2e7d32" }}>Ecoguardian</span>
        </h2>
        <div style={styles.imgWrapper}>
          <img src="/images/papa.jpg" alt="Papa" style={styles.img} />
        </div>
      </section>

      {/* Menú principal */}
      <section style={styles.menuSection}>
        <div style={{ ...styles.card, background: "linear-gradient(135deg, #a5d6a7, #81c784)" }} className="menu-card">
          <FaSeedling size={40} style={{ marginBottom: "10px" }} />
          <h3 style={styles.cardTitle}>Recomendaciones</h3>
        </div>

        <div style={{ ...styles.card, background: "linear-gradient(135deg, #ffcc80, #ffa726)" }} className="menu-card">
          <FaRoute size={40} style={{ marginBottom: "10px" }} />
          <h3 style={styles.cardTitle}>Rutas de Apoyo</h3>
        </div>

        <Link to="/minigames" style={{ textDecoration: "none", color: "inherit" }}>
            <div
                style={{
                ...styles.card,
                background: "linear-gradient(135deg, #90caf9, #42a5f5)",
                }}
                className="menu-card"
            >
                <FaGamepad size={40} style={{ marginBottom: "10px" }} />
                <h3 style={styles.cardTitle}>Aprende con nosotros</h3>
            </div>
        </Link>
      </section>

      {/* Footer */}
      <FooterNav />
    </div>
  );
}

export default Home;

// ESTILOS
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    paddingBottom: "80px",
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
    background: "#f5f7fa",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    background: "#ffffff",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    fontWeight: "500",
    fontSize: "1.1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  greeting: {
    display: "flex",
    alignItems: "center",
    fontSize: "1.2rem",
  },
  parcela: {
    textAlign: "center",
    margin: "30px 0",
    animation: "fadeInUp 1s ease",
  },
  imgWrapper: {
    display: "inline-block",
    padding: "8px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #66bb6a, #43a047)",
    marginTop: "10px",
  },
  img: {
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "15px",
    color: "#333",
  },
  menuSection: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    padding: "20px",
  },
  card: {
    padding: "35px",
    borderRadius: "18px",
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "#fff",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
  },
  cardTitle: {
    marginTop: "10px",
    fontSize: "1.3rem",
  },
};
