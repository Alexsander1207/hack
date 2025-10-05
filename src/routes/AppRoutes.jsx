// src/App.js
import React from 'react';
import '../App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ParcelProvider } from '../context/ParcelContext'; // ← AGREGAR ESTO
import Home from "../pages/HomeTemp";
import AddParcel from "../pages/AddParcel";
import Docs from "../pages/Docs";
import GameController from "../components/GameController";

function AppRoutes() {
  return (
    <ParcelProvider>  
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/minigames" element={<GameController />} />
          <Route path="/add" element={<AddParcel />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/game-controller" element={<GameController />} />
        </Routes>
      </Router>
    </ParcelProvider> 
  );
}
  
export default AppRoutes;