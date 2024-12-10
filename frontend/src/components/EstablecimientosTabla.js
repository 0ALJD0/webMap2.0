// src/components/EstablecimientosTabla.js
import React from 'react';
import './css/EstablecimientosTabla.css';

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
      <table className="el-table">
        <tbody>
          <tr>
            <td className="el-table-header">Nombre:</td>
            <td className="el-table-value">{nombre}</td>
          </tr>
          <tr>
            <td className="el-table-header">Dirección:</td>
            <td className="el-table-value">{direccion}</td>
          </tr>
          <tr>
            <td className="el-table-header">Descripción:</td>
            <td className="el-table-value">{descripcion}</td>
          </tr>
          <tr>
            <td className="el-table-header">Tipo:</td>
            <td className="el-table-value">{tipo}</td>
          </tr>
          <tr>
            <td className="el-table-header">Horarios:</td>
            <td className="el-table-value">
              <div className="el-horarios-container">
                {horarios.map((horario, index) => (
                  <div key={index} className="el-horario">
                    {horario.dia}, desde {horario.apertura} hasta {horario.cierre}
                  </div>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EstablecimientosTabla;
