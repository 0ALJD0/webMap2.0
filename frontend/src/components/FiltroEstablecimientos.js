import React, { useState, useRef } from 'react';
import './css/FiltroEstablecimientos.css';
import { FaCoffee, FaUtensils, FaGlassCheers, FaMusic, FaStore, FaTruck, FaConciergeBell, FaChevronCircleLeft, FaChevronCircleRight, FaStar } from 'react-icons/fa';

const tiposEstablecimientos = [
  { nombre: 'Cafetería', clave: 'Cafetería', icono: <FaCoffee /> },
  { nombre: 'Restaurante', clave: 'Restaurante', icono: <FaUtensils /> },
  { nombre: 'Bar', clave: 'Bar', icono: <FaGlassCheers /> },
  { nombre: 'Discoteca', clave: 'Discoteca', icono: <FaMusic /> },
  { nombre: 'Plaza de comida', clave: 'Plaza de comida', icono: <FaStore /> },
  { nombre: 'Establecimiento móvil', clave: 'Establecimiento móvil', icono: <FaTruck /> },
  { nombre: 'Servicio de catering', clave: 'Servicio de catering', icono: <FaConciergeBell /> },
];

const valoraciones = [
  { nombre: '1 estrella', clave: 1, icono: <FaStar color='gold'/> },
  { nombre: '2 estrellas', clave: 2, icono: <><FaStar color='gold'/><FaStar color='gold'/></> },
  { nombre: '3 estrellas', clave: 3, icono: <><FaStar color='gold'/><FaStar color='gold'/><FaStar color='gold'/></> },
  { nombre: '4 estrellas', clave: 4, icono: <><FaStar color='gold'/><FaStar color='gold'/><FaStar color='gold'/><FaStar color='gold'/></> },
  { nombre: '5 estrellas', clave: 5, icono: <><FaStar color='gold'/><FaStar color='gold'/><FaStar color='gold'/><FaStar color='gold'/><FaStar color='gold'/></> },
];

const FiltroEstablecimientos = ({ onFiltrar }) => {
  const [filtrosTipo, setFiltrosTipo] = useState([]);
  const [filtrosValoracion, setFiltrosValoracion] = useState([]);
  const filtroContainerRef = useRef(null);

  // Manejar selección y deselección de filtros de tipo
  const toggleFiltroTipo = (clave) => {
    let nuevosFiltros = filtrosTipo.includes(clave)
      ? filtrosTipo.filter(f => f !== clave)
      : [...filtrosTipo, clave];
    setFiltrosTipo(nuevosFiltros);
    onFiltrar({ tipos: nuevosFiltros, valoraciones: filtrosValoracion }); // Notificar al padre
  };

  // Manejar selección y deselección de filtros de valoración
  const toggleFiltroValoracion = (clave) => {
    let nuevosFiltros = filtrosValoracion.includes(clave)
      ? filtrosValoracion.filter(f => f !== clave)
      : [...filtrosValoracion, clave];
    setFiltrosValoracion(nuevosFiltros);
    onFiltrar({ tipos: filtrosTipo, valoraciones: nuevosFiltros }); // Notificar al padre
  };

  // Desplazamiento horizontal
  const scroll = (direction) => {
    const container = filtroContainerRef.current;
    const scrollAmount = 200; // Ajusta este valor según sea necesario
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="filtro-wrapper">
      <button className="filtro-flecha" onClick={() => scroll('left')}>
        <FaChevronCircleLeft  />
      </button>

      {/* Filtros combinados en un solo contenedor */}
      <div className="filtro-container" ref={filtroContainerRef}>
        <div className="filtro-tipos-wrapper">
          {tiposEstablecimientos.map(({ nombre, clave, icono }) => (
            <button
              key={clave}
              className={`filtro-boton ${filtrosTipo.includes(clave) ? 'activo' : ''}`}
              onClick={() => toggleFiltroTipo(clave)}
            >
              {icono} {nombre}
            </button>
          ))}
        </div>

        <div className="filtro-valoraciones-wrapper">
          {valoraciones.map(({ nombre, clave, icono }) => (
            <button
              key={clave}
              className={`filtro-boton ${filtrosValoracion.includes(clave) ? 'activo' : ''}`}
              onClick={() => toggleFiltroValoracion(clave)}
            >
              {icono}
            </button>
          ))}
        </div>
      </div>

      <button className="filtro-flecha" onClick={() => scroll('right')}>
        <FaChevronCircleRight />
      </button>
    </div>
  );
};

export default FiltroEstablecimientos;
