// src/components/CrearEditarHorarios.js
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { agregarHorario, actualizarHorario, obtenerHorarios } from '../services/api';
import ListarHorarios from './ListarHorarios';
import './css/CrearEditarHorarios.css';



const diaOptions = [
  { value: 'Lunes', label: 'Lunes' },
  { value: 'Martes', label: 'Martes' },
  { value: 'Miércoles', label: 'Miércoles' },
  { value: 'Jueves', label: 'Jueves' },
  { value: 'Viernes', label: 'Viernes' },
  { value: 'Sábado', label: 'Sábado' },
  { value: 'Domingo', label: 'Domingo' }
];
const CrearEditarHorarios = ({ establecimientoId, onCancel }) => {
  const [horarios, setHorarios] = useState([]);
  const [diaSemana, setDiaSemana] = useState(null);
  const [horaApertura, setHoraApertura] = useState('');
  const [horaCierre, setHoraCierre] = useState('');
  const [horarioActual, setHorarioActual] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(''); // Aquí se define el estado y la función setError

  const fetchHorarios = async () => {
    try {
      const data = await obtenerHorarios(establecimientoId);
      setHorarios(data);
      setError('');
      console.log(establecimientoId);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No hay horarios para el establecimiento');
      } else {
        setError('Error al obtener horarios');
      }
    }
  };


useEffect(() => {
      fetchHorarios();
  }, []);

  const mostrarMensajeTemporal = (msg) => {
    setMensaje(msg);
    setTimeout(() => {
      setMensaje('');
    }, 3000);
  };

  const handleAgregarHorario = async () => {
    try {
      await agregarHorario(establecimientoId, { dia_semana: diaSemana.value, hora_apertura: horaApertura, hora_cierre: horaCierre });
      await fetchHorarios();
      mostrarMensajeTemporal('Horario agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar horario:', error);
      mostrarMensajeTemporal('Error al agregar horario');
    }
  };

  const handleActualizarHorario = async () => {
    try {
      console.log(horarioActual);
      await actualizarHorario(horarioActual['horario.id'], { dia_semana: diaSemana.value, hora_apertura: horaApertura, hora_cierre: horaCierre });
      await fetchHorarios();
      mostrarMensajeTemporal('Horario actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar horario:', error);
      mostrarMensajeTemporal('Error al actualizar horario');
    }
  };



  const handleSubmit = () => {
    if (!diaSemana || !horaApertura || !horaCierre) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (horaApertura >= horaCierre) {
      setError('La hora de apertura debe ser menor que la hora de cierre.');
      return;
    }
    if (horarioActual) {
      handleActualizarHorario();
    } else {
      handleAgregarHorario();
    }
    setDiaSemana(null);
    setHoraApertura('');
    setHoraCierre('');
    setHorarioActual(null);
    setError('');
  };

  const handleEdit = (horario) => {
    setHorarioActual(horario);
    setDiaSemana(diaOptions.find(option => option.value === horario.dia) || null);
    setHoraApertura(horario.apertura || '');
    setHoraCierre(horario.cierre || '');
  };



  return (
    <div className="ceh-popup">
      <h3>Horarios</h3>
      {mensaje && <p>{mensaje}</p>}
      {error && <p className="ceh-error-message">{error}</p>}
      <label>Día:</label>
      <Select
        value={diaSemana}
        onChange={(selectedOption) => setDiaSemana(selectedOption)}
        options={diaOptions}
        className="ceh-select"
        placeholder="Selecciona día de la semana"
      />
      <label>Hora de Apertura:</label>
      <input
        type="time"
        value={horaApertura}
        onChange={(e) => setHoraApertura(e.target.value)}
        className="ceh-input"
        required
      />
      <label>Hora de Cierre:</label>
      <input
        type="time"
        value={horaCierre}
        onChange={(e) => setHoraCierre(e.target.value)}
        className="ceh-input"
        required
      />
      <button onClick={handleSubmit} className="ceh-button">
        {horarioActual ? 'Actualizar Horario' : 'Agregar Horario'}
      </button>

      <div className="ceh-container">
        <ListarHorarios horarios={horarios} onEdit={handleEdit} fetchHorarios={fetchHorarios} error={error} />
      </div>

      <button onClick={onCancel} className="ceh-button ceh-button-secondary">Cerrar</button>
      
    </div>
  );
};


export default CrearEditarHorarios;
