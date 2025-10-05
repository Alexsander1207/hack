import React from 'react';
import { FaHome, FaFolderOpen, FaPlusCircle, FaGlobe, FaUser } from "react-icons/fa";

function FooterNav() {
  return (
    <footer style={styles.footer}>
      <nav style={styles.navIcons}>
        <a href="/" style={styles.icon}><FaHome size={22} /></a>
        <a href="/docs" style={styles.icon}><FaFolderOpen size={22} /></a>
        
        {/* Botón central más grande */}
        <a href="/add" style={styles.plusButton}>
          <FaPlusCircle size={36} />
        </a>
        
        <a href="/world" style={styles.icon}><FaGlobe size={22} /></a>
        <a href="/profile" style={styles.icon}><FaUser size={22} /></a>
      </nav>
    </footer>
  );
}

export default FooterNav;

const styles = {
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    background: "#ffffff",
    borderTop: "1px solid #eee",
    padding: "10px 8px", // mismo padding lateral que en header
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 -2px 6px rgba(0,0,0,0.05)", // mismo estilo que el header
  },
  navIcons: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: "10px",
  },
  icon: {
    color: "#8B5E3C", // marrón para los íconos
    textDecoration: "none",
  },
  plusButton: {
    color: "#A0522D", // marrón más fuerte para resaltar
    textDecoration: "none",
    fontSize: "40px",
  },
  searchBar: {
    display: "flex",
    justifyContent: "center",
    gap: "5px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "10px",
    border: "1px solid #8B5E3C",
  },
  button: {
    background: "#A0522D", // marrón más intenso para el botón buscar
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "8px 12px",
    cursor: "pointer",
  },
};
