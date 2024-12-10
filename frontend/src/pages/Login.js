// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import './css/Login.css';

const LoginPage = () => {
    const [usuario, setUsername] = useState('');
    const [contrasena, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(usuario,contrasena,'login');
      await login({ usuario, contrasena });
      navigate('/admin');
      sessionStorage.setItem('authenticated', 'true');
      
    } catch (error) {
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
    }
  };

  return (
          <div className="login-page-container">
          <div className="login-box">
              <h1>Inicio de Sesión</h1>
              {error && <p className="error-message">{error}</p>}
              <form onSubmit={handleSubmit}>
                  <div className="input-group">
                      <label>Usuario:</label>
                      <input
                          type="text"
                          value={usuario}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                      />
                  </div>
                  <div className="input-group">
                      <label>Contraseña:</label>
                      <input
                          type="password"
                          value={contrasena}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                  </div>
                  <button type="submit" className="login-button">Iniciar Sesión</button>
              </form>
          </div>
        </div>
          );
};

export default LoginPage;
