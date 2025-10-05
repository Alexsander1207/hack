import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "../pages/HomeTemp";
import Minigames from "../pages/MiniGames";
import PotatoDiseaseGame from "../pages/PotatoDiseaseGame ";

function AppRoutes(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/minigames" element={<Minigames />} />
                <Route path="/rancha-papa" element={<PotatoDiseaseGame />} />
                <Route path="/add" element={<PotatoDiseaseGame />} />

            </Routes>
        </Router>
    )

} 

export default AppRoutes