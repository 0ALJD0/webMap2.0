// src/components/EstablecimientosLista.js
import React, {useState} from 'react';
import { eliminarEstablecimiento } from '../services/api';
import './css/EstablecimientosLista.css';

const EstablecimientosLista = ({ establecimientos, onEdit, onEliminar, mostrarMensaje, ubicacion }) => {
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [establecimientoAEliminar, setEstablecimientoAEliminar] = useState(null);

  const handleEliminar = async () => {
    if (!establecimientoAEliminar) return;
    try {
      const response = await eliminarEstablecimiento(establecimientoAEliminar.id);
      mostrarMensaje(response.message);
      onEliminar(); // Actualizar la lista de establecimientos
      setConfirmarEliminar(false);
    } catch (error) {
      console.error('Error eliminando establecimiento:', error);
      alert('Error eliminando establecimiento');
    }
  };

  const abrirConfirmacion = (establecimiento) => {
    setEstablecimientoAEliminar(establecimiento);
    setConfirmarEliminar(true);
  };

  const cerrarConfirmacion = () => {
    setConfirmarEliminar(false);
    setEstablecimientoAEliminar(null);
  };

  const handleUbicacion = async (data)=>{
    ubicacion(data);
  }
  return (
    <div className="el-container">
      {establecimientos.map(est => (
        <div key={est.id} className="el-item">
          <h2 className="el-title">{est.nombre}</h2>
          <p className="el-address">Dirección: {est.direccion}</p>
          <p className='el-address'>Tipo: {est.tipo} </p>
          <button onClick={() => onEdit(est)} className="el-button el-button-edit">Editar</button>
          <button onClick={() => abrirConfirmacion(est)} className="el-button el-button-delete">Eliminar</button>
          <button onClick={()=> handleUbicacion([est.longitud, est.latitud])} className="el-button el-button-edit">Ir</button>
        </div>
      ))}
      {confirmarEliminar && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>¿Está seguro que desea eliminar el establecimiento "{establecimientoAEliminar?.nombre}"?</h3>
            <div className="popup-buttons">
              <button className="el-button el-button-cancel" onClick={cerrarConfirmacion}>Cancelar</button>
              <button className="el-button el-button-deleted" onClick={handleEliminar}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EstablecimientosLista;
