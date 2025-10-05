import React, { useState } from 'react';
import { FaHome, FaFolderOpen, FaPlusCircle } from "react-icons/fa";
import {  useNavigate } from "react-router-dom";

function FooterNav() {
  const navigate = useNavigate();
  const [activeIcon, setActiveIcon] = useState('home');

const navItems = [
  { id: 'home', href: '/', Icon: FaHome, label: 'Inicio' },
  { id: 'add', href: '/add', Icon: FaPlusCircle, label: 'Crear', isCenter: true },
  { id: 'docs', href: '/docs', Icon: FaFolderOpen, label: 'Docs' }
];

  const handleNavClick = (href, id) => {
    setActiveIcon(id);
    navigate(href);
  };

  return (
    <footer style={styles.footer}>
      <nav style={styles.navIcons}>
        {navItems.map(({ id, href, Icon, label, isCenter }) => (
          <div
            key={id}
            style={{
              ...styles.navItem,
              ...(isCenter ? styles.centerButton : {}),
              ...(activeIcon === id && !isCenter ? styles.activeNavItem : {}),
              position: 'relative'
            }}
            onClick={() => handleNavClick(href, id)}
            onMouseEnter={(e) => {
              if (!isCenter) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.color = '#764ba2';
              } else {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.1)';
                const tooltip = e.currentTarget.querySelector('.tooltip');
                if (tooltip) tooltip.style.opacity = '1';
              }
            }}
            onMouseLeave={(e) => {
              if (!isCenter) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.color = activeIcon === id ? '#667eea' : '#7f8c8d';
              } else {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                const tooltip = e.currentTarget.querySelector('.tooltip');
                if (tooltip) tooltip.style.opacity = '0';
              }
            }}
          >
            <div style={styles.iconWrapper}>
              <Icon size={isCenter ? 32 : 24} />
              {activeIcon === id && !isCenter && <div style={styles.activeDot} />}
            </div>
            {isCenter && (
              <>
                <div style={styles.centerGlow} />
                <div className="tooltip" style={styles.tooltip}>
                  Agregar Parcela
                </div>
              </>
            )}
          </div>
        ))}
      </nav>
      
      {/* Indicador de página */}
      <div style={styles.pageIndicator}>
        <div style={styles.indicatorBar}>
          {navItems.filter(item => !item.isCenter).map(({ id }) => (
            <div
              key={id}
              style={{
                ...styles.indicatorDot,
                ...(activeIcon === id ? styles.indicatorDotActive : {})
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}

export default FooterNav;

const styles = {
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,1) 100%)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(102, 126, 234, 0.15)',
    padding: '12px 20px 8px 20px',
    boxShadow: '0 -4px 20px rgba(102, 126, 234, 0.1)',
    zIndex: 1000,
    transition: 'all 0.3s ease'
  },
  
  navIcons: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    position: 'relative'
  },
  
  navItem: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    color: '#7f8c8d',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '12px'
  },
  
  activeNavItem: {
    color: '#667eea',
    background: 'rgba(102, 126, 234, 0.08)'
  },
  
  iconWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  activeDot: {
    position: 'absolute',
    bottom: '-8px',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 0 8px rgba(102, 126, 234, 0.6)',
    animation: 'pulse 2s ease-in-out infinite'
  },
  
  centerButton: {
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '16px',
    borderRadius: '50%',
    transform: 'translateY(-5px) scale(1.05)',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(118, 75, 162, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 10
  },
  
  centerGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%)',
    filter: 'blur(15px)',
    zIndex: -1,
    animation: 'glowPulse 3s ease-in-out infinite'
  },
  
  pageIndicator: {
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '4px'
  },
  
  indicatorBar: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  
  indicatorDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#e0e0e0',
    transition: 'all 0.3s ease'
  },
  
  indicatorDotActive: {
    width: '24px',
    borderRadius: '3px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 0 10px rgba(102, 126, 234, 0.5)'
  }
};

// Inyectar animaciones CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.5); }
  }
  
  @keyframes glowPulse {
    0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
  }
`;
document.head.appendChild(styleSheet);