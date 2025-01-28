// src/components/CrearEditarEstablecimiento.js
import React, { useState, useEffect  } from 'react';
import Select from 'react-select';
import CreatableSelect  from 'react-select';
import { MultiSelect } from 'react-multi-select-component';
import { crearEstablecimiento, actualizarEstablecimiento, fetchTipoServicios, fetchEstablecimiento, fetchTipoCocina  } from '../services/api';
import CrearEditarHorarios from '../components/CrearEditarHorarios';
import SeleccionarUbicacion from './SeleccionarUbicacion';
import './css/CrearEditarEstablecimiento.css';

const obtenerTiposDeServicio = async () => {
    const response = await fetchTipoServicios(); // Asume que fetchTipoServicios ya está definida
    return response
  }
const obtenerTiposDeCocina = async () => {
    const response = await fetchTipoCocina(); // Asume que fetchTipoServicios ya está definida
    return response
  }
const obtenerTiposDeServicioEst = async (idEstablecimiento) => {
  const response = await fetchEstablecimiento(idEstablecimiento); // Asume que fetchTipoServicios ya está definida
  return response.tipo_servicio
}
const obtenerTiposDeCocinaEst = async (idEstablecimiento) => {
  const response = await fetchEstablecimiento(idEstablecimiento); // Asume que fetchTipoServicios ya está definida
  return response.tipo_cocina
}
//cafeteria, bar, restaruete, discoteca, estableimiento movil, plaza de comida, servicio catering
const tipos = [
  { value: '0', label: 'Cafetería' },
  { value: '1', label: 'Bar' },
  { value: '2', label: 'Restaurante' },
  { value: '3', label: 'Discoteca' },
  { value: '4', label: 'Establecimiento móvil' },
  { value: '5', label: 'Plaza de comida' },
  { value: '6', label: 'Servicio Catering' },
];

const CrearEditarEstablecimiento = ({ establecimiento, onSuccess, onCancel  }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [opcionesTipoServicio, setOpcionesTipoServicio] = useState([]);
  const [tipoServiciosSeleccionados, setTipoServiciosSeleccionados] = useState([]);
  const[nCopas, setNCopas] = useState(1);
  const[nTazas, setNTazas] = useState(1);
  const[nTenedores, setNTenedores] = useState(1);
  const [opcionesTipoCocina, setOpcionesTipoCocina] = useState([]);
  const [tipoCocinaSeleccionados, setTipoCocinaSeleccionados] = useState([]);
  const [error, setError] = useState(''); // Aquí se define el estado y la función setError
  const [mostrarHorarios, setMostrarHorarios] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false); // Nuevo estado


  useEffect(() => {

    if (establecimiento) {
      setNombre(establecimiento.nombre);
      setDireccion(establecimiento.direccion);
      setLatitud(establecimiento.latitud);
      setLongitud(establecimiento.longitud);
      setDescripcion(establecimiento.descripcion);
      setTipo(tipos.find(option => option.value === establecimiento.tipo));
      setTipoSeleccionado(establecimiento.tipo);
      setNCopas(establecimiento.numero_copas);
      setNTazas(establecimiento.numero_taza);
      setNTenedores(establecimiento.numero_cubiertos);
      // Cargar tipos de servicio
      const cargarTiposDeServicio = async () => {
        const tipos = await obtenerTiposDeServicio();
        const opciones = tipos.map((tipo) => ({
          value: tipo.id,
          label: tipo.nombre,
        }));
        setOpcionesTipoServicio(opciones);
      };
      const cargarTiposDeServicioActual = async () => {
         // Obtener los tipos de servicio seleccionados para este establecimiento
         const tiposServicioEstablecimiento = await obtenerTiposDeServicioEst(establecimiento.id);
         // Formatear los tipos de servicio seleccionados para CreatableSelect
         const tiposSeleccionados = tiposServicioEstablecimiento.map((tipo) => ({
           value: tipo.id,
           label: tipo.nombre,
         }));
         setTipoServiciosSeleccionados(tiposSeleccionados);
      };
      
      cargarTiposDeServicio();
      cargarTiposDeServicioActual();
      
      // Cargar tipos de cocina
      const cargarTiposDeCocina = async () => {
        const tipos = await obtenerTiposDeCocina();
        const opciones = tipos.map((tipo) => ({
          value: tipo.id,
          label: tipo.nombre,
        }));
        setOpcionesTipoCocina(opciones);
      };
      const cargarTiposDeCocinaActual = async () => {
         // Obtener los tipos de cocina seleccionados para este establecimiento
         const tiposCocinaEstablecimiento = await obtenerTiposDeCocinaEst(establecimiento.id);
         // Formatear los tipos de cocina seleccionados para CreatableSelect
         const tiposSeleccionados = tiposCocinaEstablecimiento.map((tipo) => ({
           value: tipo.id,
           label: tipo.nombre,
         }));
         setTipoCocinaSeleccionados(tiposSeleccionados);
      };
      
      cargarTiposDeCocina();
      cargarTiposDeCocinaActual();

    }
  
  }, [establecimiento]);

  const handleSeleccionarUbicacion = (lat, lng) => {
    setLatitud(lat.toFixed(6));
    setLongitud(lng.toFixed(6));
    setMostrarMapa(false);
  };

  const handleGuardarEstablecimiento = async () => {
    try {
      if (!nombre || !direccion || !latitud || !longitud) {
        setError('Por favor complete todos los campos obligatorios.');
        return;
      }

      if (isNaN(parseFloat(latitud)) || isNaN(parseFloat(longitud))) {
        setError('Latitud y Longitud deben ser números válidos. Ejemplo: -0.97476, -80.66443');
        return;
      }

      const payload = {
        nombre,
        direccion,
        latitud,
        longitud,
        descripcion,
        tipo,
        tipo_servicio: tipoServiciosSeleccionados.map(servicio => servicio.value),
        tipo_cocina: tipoCocinaSeleccionados.map(cocina => cocina.value),
        numero_copas:nCopas,
        nuemero_taza:nTenedores,
      };
      if (establecimiento) {
        await actualizarEstablecimiento(establecimiento.id, payload);
      } else {
        await crearEstablecimiento(payload);
      }
      if (onSuccess) {
        onSuccess();
      }
      onCancel();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('Establecimiento con este nombre ya existe');
      } else if (error.response && error.response.status === 403) {
        setError('No estás autorizado para realizar esta acción.');
      } else {
        setError('Error al crear establecimiento.');
      }
    }
  };

  const handleChangeServicio = (seleccionados) => {
    setTipoServiciosSeleccionados(seleccionados || []);
  };
  const handleChangeCocina = (seleccionados) => {
    setTipoCocinaSeleccionados(seleccionados || []);
  };


  const handleToggleHorarios = () => {
    setMostrarHorarios(!mostrarHorarios);
  };

  return (
    <div className="ce-popup-container">
      <div className="ce-crearEditarEstablecimiento">
        <h2>{establecimiento ? 'Editar' : 'Crear'} Establecimiento</h2>
        {error && <p className="ce-error-message">{error}</p>}
        <label>Nombre:</label>
        <input type="text" placeholder="Nombre *" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <label>Tipo de Establecimiento:</label>
        <p>Actualmente: {tipoSeleccionado? tipoSeleccionado : 'Ninguno'}</p>
        <Select 
          className='ce-select'
          value={tipos.find(option => option.label === tipo) } // Asegurarte de mostrar la opción correcta basada en el label
          onChange={(selectedOption) => setTipo(selectedOption.label)} // Guardar solo el label
          options={tipos} 
          placeholder="Selecciona un tipo"
        />
        {establecimiento &&(tipo === 'Cafetería' || tipo === 'Restaurante' || tipo === 'Bar' ) && (
          <div>
          <label>Tipos de Servicio:</label>
          <CreatableSelect
            isMulti
            options={opcionesTipoServicio}
            value={tipoServiciosSeleccionados}
            onChange={handleChangeServicio}
            placeholder="Selecciona o añade tipos de servicio"
            getOptionLabel={(e) => e.label}
            getOptionValue={(e) => e.value}
          />
          </div>
        )}
        {establecimiento &&(tipo === 'Cafetería' || tipo === 'Restaurante' || tipo === 'Establecimiento móvil' || tipo === 'Plaza de comida' || tipo === 'Servicio Catering' ) && (
          <div> 
            <label>Tipos de Cocina:</label>
            <CreatableSelect
              isMulti
              options={opcionesTipoCocina}
              value={tipoCocinaSeleccionados}
              onChange={handleChangeCocina}
              placeholder="Selecciona o añade tipos de cocina"
              getOptionLabel={(e) => e.label}
              getOptionValue={(e) => e.value}
            />
          </div>
        )}
        {establecimiento &&(tipo === 'Bar' ||tipo === 'Discoteca' ) && (
          <div>
            <label>Número de Copas 🍷</label>
            <input
              type="number"
              min="0"
              max="3"
              value={nCopas}
              onChange={(e) => setNCopas(e.target.value)}
              required
            />
          </div>
        )}
        {establecimiento &&(tipo === 'Cafetería' ) && (
          <div>
            <label>Número de Tazas 🍵</label>
            <input
              type="number"
              min="0"
              max="2"
              value={nTazas}
              onChange={(e) => setNTazas(e.target.value)}
              required
            />
          </div>
        )}
        {establecimiento &&(tipo === 'Restaurante' ) && (
          <div>
            <label>Número de Tenedores 🍴</label>
            <input
              type="number"
              min="0"
              max="5"
              value={nTenedores}
              onChange={(e) => setNTenedores(e.target.value)}
              required
            />
          </div>
        )}
        
        <label>Dirección:</label>
        <input type="text" placeholder="Dirección *" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        <label>Ubicación:</label>
        <div className="ce-ubicacion">
          <button className="ce-button-secondary" onClick={() => setMostrarMapa(true)}>
            Seleccionar en el mapa
          </button>
          {latitud && longitud && (
            <p>
              Latitud: {latitud}, Longitud: {longitud}
            </p>
          )}
        </div>
        {mostrarMapa && (
          <SeleccionarUbicacion
            onUbicacionSeleccionada={handleSeleccionarUbicacion}
            onCancel={() => setMostrarMapa(false)}
          />
        )}
        <label>Descripción:</label>
        <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <button className="ce-button-primary" onClick={handleGuardarEstablecimiento}>{establecimiento ? 'Editar' : 'Crear'} Establecimiento</button>
        <button className="ce-button-secondary" onClick={onCancel}>Cancelar</button>
        
        {establecimiento && (
          <>
            {!mostrarHorarios ? (
              <button className="ce-button-secondary" onClick={handleToggleHorarios}>Añadir Horario</button>
            ) : (
              <>
                <div className="ce-backdrop" onClick={handleToggleHorarios}></div>
                <div className="ce-popup-horarios">
                  <div className="ce-popup-content">
                    <CrearEditarHorarios establecimientoId={establecimiento.id} onCancel={handleToggleHorarios} />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CrearEditarEstablecimiento;
