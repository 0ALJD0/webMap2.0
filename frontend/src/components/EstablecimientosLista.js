// src/components/EstablecimientosLista.js
import React from 'react';
import { eliminarEstablecimiento } from '../services/api';
import './css/EstablecimientosLista.css';

const EstablecimientosLista = ({ establecimientos, onEdit, onEliminar, mostrarMensaje  }) => {
  const handleEliminar = async (id) => {
    try {
      const response = await eliminarEstablecimiento(id);
      mostrarMensaje(response.message);
      onEliminar(); // Actualizar la lista de establecimientos
    } catch (error) {
      console.error('Error eliminando establecimiento:', error);
      alert('Error eliminando establecimiento');
    }
  };
  return (
    <div className="el-container">
      {establecimientos.map(est => (
        <div key={est.id} className="el-item">
          <h2 className="el-title">{est.nombre}</h2>
          <p className="el-address">Dirección: {est.direccion}</p>
          <p className='el-address'>Tipo: {est.tipo} </p>
          <button onClick={() => onEdit(est)} className="el-button el-button-edit">Editar</button>
          <button onClick={() => handleEliminar(est.id)} className="el-button el-button-delete">Eliminar</button>
        </div>
      ))}
    </div>
  );
};
export default EstablecimientosLista;
