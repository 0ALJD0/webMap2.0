// src/components/AgenteVirtual.js
import React, { useState } from 'react';
import api from '../services/api';
import './css/AgenteVirtual.css';
const AgenteVirtual = () => {
    const [mensajeUsuario, setMensajeUsuario] = useState('');
    const [mensajesChat, setMensajesChat] = useState([
      { 
        text: `
          👋 ¡Hola! Soy tu asistente virtual de establecimientos. <br><br>
          Puedes preguntarme sobre: <br>
          - 🍽️ <b>Restaurantes disponibles</b> <br>
          - ⏰ <b>Horarios de atención</b> <br>
          - ⭐ <b>Valoraciones</b> <br>
          - 📍 <b>Dirección</b> <br><br>
          <i>Ejemplo:</i> "¿Cuáles son los restaurantes mejor valorados?"`,
        fromUser: false 
      }
    ]);
  
    const preguntarAgenteVirtual = async (mensaje) => {
      try {
        const response = await api.post('/preguntar', mensaje);
        return response.data;
      } catch (error) {
        console.error('Error al consultar al agente virtual:', error);
        throw error;
      }
    };
  
    const enviarMensaje = async () => {
      if (mensajeUsuario.trim() === '') return;
  
      // Agrega el mensaje del usuario al historial del chat
      setMensajesChat([...mensajesChat, { text: mensajeUsuario, fromUser: true }]);
      setMensajeUsuario('');
  
      // Realiza la consulta al agente virtual
      try {
        const respuesta = await preguntarAgenteVirtual({ pregunta: mensajeUsuario });
        setMensajesChat([...mensajesChat, { text: respuesta.respuesta, fromUser: false }]);
      } catch (error) {
        // Agrega el mensaje de error al historial del chat
        setMensajesChat([...mensajesChat, { text: `Error: ${error.response.data.error}`, fromUser: false }]);
        console.error('Error al consultar al agente virtual:', error);
        // Manejo de errores si fuera necesario
      }
    };
  
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        enviarMensaje();
      }
    };
  
    return (
      <div className="agente-virtual">
        <div className="chat-container">
          
          <div className="chat">
            {mensajesChat.map((mensaje, index) => (
            <div 
              key={index} 
              className={`message ${mensaje.fromUser ? 'user' : 'agent'}`}
              dangerouslySetInnerHTML={{ __html: mensaje.text }} 
            />
            ))}
          </div>
        </div>
        <div className='av-bajo'>
          <textarea
            className="input-message"
            placeholder="Pregunta sobre algún establecimiento o dime las características que esperas de tu establecimiento"
            value={mensajeUsuario}
            onChange={(e) => setMensajeUsuario(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="send-button" onClick={enviarMensaje}>Enviar</button>
        </div>
      </div>
    );
  };
  
  export default AgenteVirtual;