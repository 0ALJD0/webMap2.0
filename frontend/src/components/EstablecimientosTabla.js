// src/components/EstablecimientosTabla.js
import React from 'react';
import './css/EstablecimientosTabla.css';
import { FaMapMarkerAlt, FaRegClock, FaStore, FaInfoCircle } from 'react-icons/fa'; // Iconos de react-icons

const EstablecimientosTabla = ({ establecimiento }) => {
  if (!establecimiento) {
    return (
      <div>
        <h2>Da clic sobre un globo para mostrar sus detalles</h2>
      </div>
    );
  }

  const { nombre, direccion, descripcion, tipo, horarios } = establecimiento;

  return (
    <div className="el-detalles">
      <h2>Detalles del Establecimiento</h2>
      <div className="el-detalles-contenedor">
        <div className="el-detalle-item">
          <FaStore className="el-icon" />
          <div>
            <strong>Nombre:</strong>
            <span>{nombre}</span>
          </div>
        </div>
        <div className="el-detalle-item">
          <FaMapMarkerAlt className="el-icon" />
          <div>
            <strong>Dirección:</strong>
            <span>{direccion}</span>
          </div>
        </div>
        <div className="el-detalle-item">
          <FaInfoCircle className="el-icon" />
          <div>
            <strong>Descripción:</strong>
            <span>{descripcion}</span>
          </div>
        </div>
        <div className="el-detalle-item">
          <FaStore className="el-icon" />
          <div>
            <strong>Tipo:</strong>
            <span>{tipo}</span>
          </div>
        </div>
        <div className="el-detalle-item">
          <FaRegClock className="el-icon" />
          <div>
            <strong>Horarios:</strong>
            <div className="el-horarios-container">
              {horarios.map((horario, index) => (
                <div key={index} className="el-horario">
                  {horario.dia}, desde {horario.apertura} hasta {horario.cierre}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablecimientosTabla;
