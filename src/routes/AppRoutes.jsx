// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/HomeTemp";
import Minigames from "../pages/MiniGames";
import PotatoDiseaseGame from "../pages/PotatoDiseaseGame";
import GameController from './components/GameController'; // Importamos el cerebro del juego

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/minigames" element={<Minigames />} />
        <Route path="/rancha-papa" element={<PotatoDiseaseGame />} />
        <Route path="/add" element={<PotatoDiseaseGame />} />
        {/* Si quieres usar GameController como ruta */}
        <Route path="/game-controller" element={<GameController />} />
      </Routes>
    </Router>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
