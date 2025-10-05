import React from "react";
import { motion } from "framer-motion";
import FooterNav from "../components/FooterNav";
import { 
  FaSeedling, 
  FaBug, 
  FaBrain, 
  FaTractor 
} from "react-icons/fa";

function Minigames() {
  const games = [
    { id: 1, name: "Trivia Agrícola", icon: <FaBrain size={50} color="#1565c0" />, color: "linear-gradient(135deg, #bbdefb, #64b5f6)" },
    { id: 2, name: "Atrapa la Plaga", icon: <FaBug size={50} color="#c62828" />, color: "linear-gradient(135deg, #ffcdd2, #ef5350)" },
    { id: 3, name: "Siembra Correcta", icon: <FaSeedling size={50} color="#2e7d32" />, color: "linear-gradient(135deg, #c8e6c9, #81c784)" },
    { id: 4, name: "Carrera del Tractor", icon: <FaTractor size={50} color="#ef6c00" />, color: "linear-gradient(135deg, #ffe0b2, #ffb74d)" },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Minijuegos Educativos</h2>
        <p style={styles.subtitle}>Aprende jugando mientras cuidas tus cultivos 🌱</p>
      </header>

      <section style={styles.grid}>
        {games.map((game) => (
          <motion.div
            key={game.id}
            style={{ ...styles.card, background: game.color }}
            whileHover={{ scale: 1.07, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div style={styles.icon}>{game.icon}</div>
            <h3 style={styles.gameTitle}>{game.name}</h3>
          </motion.div>
        ))}
      </section>

      {/* Footer global */}
      <FooterNav />
    </div>
  );
}

export default Minigames;

// 🎨 ESTILOS
const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f1f8e9, #f9fafb)",
    paddingBottom: "80px",
    overflow: "hidden"
  },
  header: {
    textAlign: "center",
    marginBottom: "20px"
  },
  title: {
    fontSize: "2rem",
    margin: "10px 0",
    color: "#2e7d32"
  },
  subtitle: {
    fontSize: "1rem",
    color: "#555"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    marginTop: "20px"
  },
  card: {
    padding: "25px",
    borderRadius: "20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
    color: "#fff",
  },
  icon: {
    marginBottom: "15px",
  },
  gameTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
  }
};
