// src/components/EstablecimientosTabla.js
import React from 'react';
import './css/EstablecimientosTabla.css';
import { FaStore, FaMapMarkerAlt, FaInfoCircle, FaRegClock, FaWheelchair, FaDog, FaUtensils, FaConciergeBell, FaWineGlass, FaCoffee } from 'react-icons/fa'; // Iconos de react-icons

const EstablecimientosTabla = ({ establecimiento }) => {
  if (!establecimiento) {
    return (
      <div>
        <h2>Da clic sobre un globo para mostrar sus detalles</h2>
      </div>
    );
  }

  const {  nombre,
    direccion,
    descripcion,
    tipo,
    horarios,
    accesibilidad,
    petfriendly,
    numero_copas,
    numero_cubiertos,
    numero_taza,
    tipo_cocina,
    tipo_servicio, } = establecimiento;

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
        <div className="el-detalle-item">
          <FaWheelchair className="el-icon" />
          <div>
            <strong>Accesibilidad:</strong>
            <span>{accesibilidad ? "Sí" : "No"}</span>
          </div>
        </div>
        <div className="el-detalle-item">
          <FaDog className="el-icon" />
          <div>
            <strong>Pet Friendly:</strong>
            <span>{petfriendly ? "Sí" : "No"}</span>
          </div>
        </div>
        {(tipo === "Bar" || tipo === "Discoteca") && (
          <div className="el-detalle-item">
            <FaWineGlass className="el-icon" />
            <div>
              <strong>Número de Copas:</strong>
              <span>{numero_copas}</span>
            </div>
          </div>
        )}
        {tipo === "Restaurante" && (
          <div className="el-detalle-item">
            <FaUtensils className="el-icon" />
            <div>
              <strong>Número de Cubiertos:</strong>
              <span>{numero_cubiertos}</span>
            </div>
          </div>
        )}
        {tipo === "Cafetería" && (
          <div className="el-detalle-item">
            <FaCoffee className="el-icon" />
            <div>
              <strong>Número de Tazas:</strong>
              <span>{numero_taza}</span>
            </div>
          </div>
        )}
        {tipo !== "Bar" && tipo !== "Discoteca" && (
          <div className="el-detalle-item">
            <FaConciergeBell className="el-icon" />
            <div>
              <strong>Tipo de Cocina:</strong>
              <span>{tipo_cocina.map(tc => tc.nombre).join(", ")}</span>
            </div>
          </div>
        )}
        {(tipo === "Cafetería" || tipo === "Bar" || tipo === "Restaurante") && (
          <div className="el-detalle-item">
            <FaConciergeBell className="el-icon" />
            <div>
              <strong>Tipo de Servicio:</strong>
              <span>{tipo_servicio.map(ts => ts.nombre).join(", ")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstablecimientosTabla;
