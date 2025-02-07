import React, { useEffect, useState } from 'react';
import { obtenerPromedioValoraciones, crearValoracion, obtenerValoraciones } from '../services/api';
import './css/ValoracionEstablecimiento.css';
import { FaStar } from "react-icons/fa";
import Estrellas from './Estrellas';
const ValoracionEstablecimiento = ({ establecimientoId }) => {
  const [promedio, setPromedio] = useState(0);
  const [valoraciones, setValoraciones] = useState([]);
  const [puntuacion, setPuntuacion] = useState(0);
  const [nombreAnonimo, setNombreAnonimo] = useState('Anónimo');
  const [comentario, setComentario] = useState('');
  const [mostrarPopup, setMostrarPopup] = useState(false); // Estado para el popup
  const [errorPuntuacion, setErrorPuntuacion] = useState(false);

  // Obtener el promedio de valoraciones al cargar el componente
  useEffect(() => {
    const fetchPromedio = async () => {
      try {
        const promedio = await obtenerPromedioValoraciones(establecimientoId);
        setPromedio(promedio);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPromedio();
  }, [establecimientoId]);

  // Obtener todas las valoraciones (opcional)
  useEffect(() => {
    const fetchValoraciones = async () => {
      try {
        const valoraciones = await obtenerValoraciones(establecimientoId);
        setValoraciones(valoraciones);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchValoraciones();
  }, [establecimientoId]);

  // Manejar el envío de una nueva valoración
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar si el usuario seleccionó una puntuación
    if (puntuacion === 0) {
      setErrorPuntuacion(true);
      setTimeout(() => setErrorPuntuacion(false), 1000); // Remover animación después de 1 segundo
      return;
    }
 
    try {
      await crearValoracion(establecimientoId, puntuacion, nombreAnonimo, comentario);
      
      // Mostrar popup de confirmación
      setMostrarPopup(true);
      setTimeout(() => {
        setMostrarPopup(false);
      }, 3000); // Ocultar popup después de 3 segundos

      // Actualizar el promedio y las valoraciones después de enviar
      const nuevoPromedio = await obtenerPromedioValoraciones(establecimientoId);
      setPromedio(nuevoPromedio);
      const nuevasValoraciones = await obtenerValoraciones(establecimientoId);
      setValoraciones(nuevasValoraciones);
      
      // Limpiar los campos del formulario
      setPuntuacion(0);
      setNombreAnonimo('Anónimo');
      setComentario('');

    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  return (
    <div className="valoraciones-container">
      <div className="promedio">
        <span className="promedio-numero">
          {Number(promedio).toFixed(1)}
          <FaStar className="estrella" size={40}/>
        </span>
      </div>

      <form className="valoraciones-form" onSubmit={handleSubmit}>
        <div className="valoracion">
          <h3 className="titulo-valoracion">Danos tu opinión</h3>
          <div className={`estrellas-container ${errorPuntuacion ? 'error' : ''}`}>
            <Estrellas puntuacion={puntuacion} onCambioPuntuacion={setPuntuacion} />
          </div>
        </div>
        <label>
          Nombre (opcional):
          <input
            type="text"
            value={nombreAnonimo}
            onChange={(e) => setNombreAnonimo(e.target.value)}
            placeholder="Escribe tu nombre aquí..."
          />
        </label>
        <label>
          Comentario:
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required
            placeholder="Escribe tu comentario aquí..."
          />
        </label>
        <button type="submit">Enviar Valoración</button>
      </form>

      {/* Popup de confirmación */}
      {mostrarPopup && (
        <div className="popup-valoraciones">
          <p>¡Opinión enviada exitosamente!</p>
        </div>
      )}

      <div className="historial-valoraciones">
        <h3>Historial de Valoraciones</h3>
        <ul>
          {valoraciones.map((valoracion) => (
            <li key={valoracion.id}>
              <strong>{valoracion.nombre_anonimo}</strong> - {valoracion.puntuacion} ⭐
              <p>{valoracion.comentario}</p>
              <small>{new Date(valoracion.fecha).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ValoracionEstablecimiento;