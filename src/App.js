// src/App.js
import React from 'react';
import './App.css'; 
import GameController from './components/GameController'; // Importamos el cerebro del juego

function App() {
  return (
    <div className="App">
      {/* Todo el juego se renderiza dentro del GameController */}
      <GameController />
    </div>
  );
}

export default App;