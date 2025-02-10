import React, { useEffect, useState, useRef } from 'react';
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
  const [verMas, setVerMas] = useState(false); // Estado para controlar la expansión de los comentarios

  // Referencia al primer comentario
  const primerComentarioRef = useRef(null);

  
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
    // Función para manejar el botón "Ver más" / "Ver menos"
    const toggleVerMas = () => {
      setVerMas(!verMas);

      if (verMas) {
        // Si estamos ocultando comentarios, hacer scroll al primer comentario
        setTimeout(() => {
          primerComentarioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300); // Retraso pequeño para asegurar que la animación de contraer haya finalizado
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

      {/* Historial de valoraciones con scroll y botones Ver más / Ver menos */}
      <div className="historial-valoraciones">
        <h3>Historial de Valoraciones</h3>
          <ul className={`lista-comentarios ${verMas ? "expandido" : ""}`}>
            {valoraciones.slice(0, verMas ? valoraciones.length : 3).map((valoracion, index) => (
              <li key={valoracion.id} ref={index === 0 ? primerComentarioRef : null}>
                <strong>{valoracion.nombre_anonimo}</strong> - {valoracion.puntuacion} ⭐
                <p>{valoracion.comentario}</p>
                <small>{new Date(valoracion.fecha).toLocaleString()}</small>
              </li>
            ))}
          </ul>

        {valoraciones.length > 3 && (
          <button className="ver-mas" onClick={toggleVerMas}>
            {verMas ? "Ver menos" : "Ver más"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ValoracionEstablecimiento;