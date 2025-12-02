import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Chemins corrigés selon ton dossier src/components
import HomeDashboard from "./components/HomeDashboard";
import Departments from "./components/Departments";
import Teachers from "./components/Teachers";
import Specialites from "./components/Specialites";
import Students from "./components/Students";
import Groupes from "./components/Groupes";
import Niveaux from "./components/Niveau";
import Salles from "./components/Salles";
import Matieres from "./components/Matieres";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<HomeDashboard />} />
        {/* Page des départements */}
        <Route path="/departements" element={<Departments />} />
         <Route path="/specialites" element={<Specialites/>} />
           <Route path="/teachers" element={<Teachers/>} />
            <Route path="/etudiants" element={<Students />} />
            <Route path="/niveaux" element={<Niveaux/>} />
            <Route path="/salles" element={<Salles/>} />
            <Route path="/matieres" element={<Matieres/>} />
            <Route path="/groupes" element={<Groupes/>} />
             
      </Routes>
    </Router>
  );
}
