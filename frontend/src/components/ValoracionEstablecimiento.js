import React, { useEffect, useState } from 'react';
import { obtenerPromedioValoraciones, crearValoracion, obtenerValoraciones } from '../services/api';
import './css/ValoracionEstablecimiento.css';
import Estrellas from './Estrellas';
const ValoracionEstablecimiento = ({ establecimientoId }) => {
  const [promedio, setPromedio] = useState(0);
  const [valoraciones, setValoraciones] = useState([]);
  const [puntuacion, setPuntuacion] = useState(0);
  const [nombreAnonimo, setNombreAnonimo] = useState('Anónimo');
  const [comentario, setComentario] = useState('');

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
    try {
      await crearValoracion(establecimientoId, puntuacion, nombreAnonimo, comentario);
      alert('Valoración enviada exitosamente');
      // Actualizar el promedio y las valoraciones después de enviar
      const nuevoPromedio = await obtenerPromedioValoraciones(establecimientoId);
      setPromedio(nuevoPromedio);
      const nuevasValoraciones = await obtenerValoraciones(establecimientoId);
      setValoraciones(nuevasValoraciones);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="valoraciones-container">
      <h2>Valoraciones</h2>
      <p className="promedio">Promedio: {promedio} ⭐</p>

      <form className="valoraciones-form" onSubmit={handleSubmit}>
        <div className='valoracion'>
          <label>
           Puntuacion (1-5):
          </label>
          
          <Estrellas puntuacion={puntuacion} onCambioPuntuacion={setPuntuacion} />
        </div>
        <label>
          Nombre (opcional):
          <input
            type="text"
            value={nombreAnonimo}
            onChange={(e) => setNombreAnonimo(e.target.value)}
          />
        </label>
        <label>
          Comentario (opcional):
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </label>
        <button type="submit">Enviar Valoración</button>
      </form>

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