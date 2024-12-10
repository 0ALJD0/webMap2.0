import React, { useState } from 'react';
import { cambiarContrasena } from '../services/api'; // Asegúrate de tener tu función para hacer la llamada a la API
import './css/CambiarContra.css';
const CambiarContra = ({ onCancel }) => {
  const [newPassword, setNewPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);

  const handleNewPasswordChange = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);
    setPasswordValid(newPasswordValue.length > 0);
  };

  const handleCambiarContrasena = async () => {
    try {
      const response = await cambiarContrasena({ new_password: newPassword });
      setMensaje(response.message);
      setNewPassword('');
      setPasswordValid(false);
    } catch (error) {
      setError('Error al cambiar la contraseña.');
    }
  };
  return (
    <div className="cc-popup-container">
      <div className="cc-cambiarContra">
        <h2>Cambiar Contraseña</h2>
        {error && <p className="cc-error-message">{error}</p>}
        {mensaje && <p className="cc-success-message">{mensaje}</p>}
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChange={handleNewPasswordChange}
        />
        <button onClick={handleCambiarContrasena} disabled={!passwordValid}>Guardar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
};

export default CambiarContra;
