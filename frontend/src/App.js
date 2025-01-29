import React from 'react';
import { Routes, Route , Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import AdminPage from './pages/AdminPage';
import Login from './pages/Login';
import IntroPage from './pages/IntroPage';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/Home" element={<HomePage />} />
      <Route path="/" element={<IntroPage />} />
      <Route
        path="/admin"
       element={
          // Asegurar que el usuario esté autenticado
          sessionStorage.getItem('authenticated') ? (
            <AdminPage />
          ) : (
            <Navigate to="/login" />
          )
        }
        
      />
    </Routes>
  );
}

export default App;
