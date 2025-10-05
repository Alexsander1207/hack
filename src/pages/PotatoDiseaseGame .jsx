// src/pages/PotatoDiseaseGame.js
import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";

/* 🌱 Arbusto (planta a defender) */
function Bush({ position, health }) {
  const ref = useRef();
  useFrame(() => {
    if (health <= 0 && ref.current) {
      ref.current.position.y -= 0.02; // se hunde
      if (ref.current.position.y < -1) ref.current.visible = false;
    }
  });

  const color = health > 66 ? "#2e7d32" : health > 33 ? "#fbc02d" : "#b71c1c";
  return (
    <group ref={ref} position={[position[0], 0, position[2]]}>
      {/* tronco */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
        <meshStandardMaterial color="#6d4c41" />
      </mesh>
      {/* copa */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ☠️ Mancha de rancha */
function Spot({ plant, onRemove, onHit }) {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      // emergen hacia arriba desde la planta
      ref.current.position.y += 0.01;

      // si sube mucho y no la clickeaste → daña planta
      if (ref.current.position.y > 1.5) {
        onHit(plant.id);
        onRemove();
      }
    }
  });

  return (
    <mesh
      ref={ref}
      position={[plant.x, 0.3, plant.z]}
      onClick={onRemove}
      castShadow
    >
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color="#000000" />
    </mesh>
  );
}

/* 🎮 Escena */
function GameScene({ plants, spots, onSpotRemove, onPlantHit }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <Sky sunPosition={[100, 20, 100]} />

      {/* terreno */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#81c784" />
      </mesh>

      {plants.map((p) => (
        <Bush key={p.id} position={[p.x, 0, p.z]} health={p.health} />
      ))}

      {spots.map((s) => (
        <Spot
          key={s.id}
          plant={s.plant}
          onRemove={() => onSpotRemove(s.id)}
          onHit={onPlantHit}
        />
      ))}
    </>
  );
}

/* 🎮 Juego Principal */
export default function PotatoDiseaseGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [plants, setPlants] = useState([]);
  const [spots, setSpots] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // inicializar plantas
  useEffect(() => {
    if (!difficulty) return;
    const newPlants = Array.from({ length: difficulty }).map((_, i) => ({
      id: i + 1,
      x: i * 2 - (difficulty - 1),
      z: 0,
      health: 100,
    }));
    setPlants(newPlants);
  }, [difficulty]);

  // generar manchas emergiendo de las plantas
  useEffect(() => {
    if (!difficulty) return;
    const interval = setInterval(() => {
      const p = plants[Math.floor(Math.random() * plants.length)];
      if (!p) return;
      setSpots((prev) => [...prev, { id: Date.now(), plant: p }]);
    }, 2000);
    return () => clearInterval(interval);
  }, [plants, difficulty]);

  // perder si todas mueren
  useEffect(() => {
    if (plants.length > 0 && plants.every((p) => p.health <= 0)) {
      setGameOver(true);
    }
  }, [plants]);

  const handlePlantHit = (id) => {
    setPlants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, health: Math.max(p.health - 20, 0) } : p
      )
    );
  };

  const handleRemoveSpot = (id) => {
    setSpots((prev) => prev.filter((s) => s.id !== id));
    setScore((s) => s + 1);
  };

  const resetGame = () => {
    setDifficulty(null);
    setPlants([]);
    setSpots([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div style={styles.container}>
      {!difficulty ? (
        <div style={styles.menu}>
          <h1>🌱 Defiende tu Papa</h1>
          <p>Selecciona cuántas plantas quieres defender</p>
          <button style={styles.btn} onClick={() => setDifficulty(1)}>
            1 Planta
          </button>
          <button style={styles.btn} onClick={() => setDifficulty(2)}>
            2 Plantas
          </button>
          <button style={styles.btn} onClick={() => setDifficulty(3)}>
            3 Plantas
          </button>
        </div>
      ) : gameOver ? (
        <div style={styles.overlay}>
          <h2>💀 ¡Perdiste!</h2>
          <p>Haz click rápido en las manchas negras antes de que crezcan.</p>
          <p>Puntaje final: {score}</p>
          <button style={styles.btn} onClick={resetGame}>
            Volver al menú
          </button>
        </div>
      ) : (
        <>
          <div style={styles.topbar}>
            <h3>Puntaje: {score}</h3>
            <div style={styles.lifebar}>
              {plants.map((p) => (
                <div key={p.id} style={{ margin: "0 10px", textAlign: "center" }}>
                  <div>Planta {p.id}</div>
                  <div
                    style={{
                      width: 80,
                      height: 10,
                      background: "#ddd",
                      borderRadius: 5,
                    }}
                  >
                    <div
                      style={{
                        width: `${p.health}%`,
                        height: "100%",
                        borderRadius: 5,
                        background:
                          p.health > 66
                            ? "#2e7d32"
                            : p.health > 33
                            ? "#fbc02d"
                            : "#b71c1c",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button style={styles.menuBtn} onClick={resetGame}>
              ☰
            </button>
          </div>
          <Canvas camera={{ position: [4, 4, 6], fov: 50 }}>
            <GameScene
              plants={plants}
              spots={spots}
              onSpotRemove={handleRemoveSpot}
              onPlantHit={handlePlantHit}
            />
          </Canvas>
        </>
      )}
    </div>
  );
}

/* 🎨 Estilos */
const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Poppins, sans-serif",
    background: "#f1f8e9",
    height: "100vh",
    overflow: "hidden",
  },
  menu: { padding: "40px" },
  btn: {
    margin: "10px",
    padding: "12px 24px",
    fontSize: "1.1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#2e7d32",
    color: "#fff",
  },
  topbar: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "rgba(255,255,255,0.8)",
    borderRadius: "8px",
    margin: "0 20px",
  },
  lifebar: { display: "flex", justifyContent: "center" },
  menuBtn: {
    fontSize: "1.4rem",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  overlay: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
  },
};
