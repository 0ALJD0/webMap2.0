import React, { useState, useRef  } from 'react';
import './css/FiltroEstablecimientos.css';
import { FaCoffee, FaUtensils, FaGlassCheers, FaMusic, FaStore, FaTruck, FaConciergeBell, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const tiposEstablecimientos = [
  { nombre: 'Cafetería', clave: 'Cafetería', icono: <FaCoffee /> },
  { nombre: 'Restaurante', clave: 'Restaurante', icono: <FaUtensils /> },
  { nombre: 'Bar', clave: 'Bar', icono: <FaGlassCheers /> },
  { nombre: 'Discoteca', clave: 'Discoteca', icono: <FaMusic /> },
  { nombre: 'Plaza de comida', clave: 'Plaza de comida', icono: <FaStore /> },
  { nombre: 'Establecimiento móvil', clave: 'Establecimiento móvil', icono: <FaTruck /> },
  { nombre: 'Servicio de catering', clave: 'Servicio de catering', icono: <FaConciergeBell /> },
];

const FiltroEstablecimientos = ({ onFiltrar }) => {
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState([]);
  const containerRef = useRef(null);

  // Manejar selección y deselección de filtros
  const toggleFiltro = (tipo) => {
    let nuevosFiltros = filtrosSeleccionados.includes(tipo)
      ? filtrosSeleccionados.filter(f => f !== tipo)
      : [...filtrosSeleccionados, tipo];

    setFiltrosSeleccionados(nuevosFiltros);
    onFiltrar(nuevosFiltros);  // ⬅ Llamamos a la función del padre con los filtros actualizados
  };

  const scroll = (direction) => {
    const container = containerRef.current;
    const scrollAmount = 200; // Ajusta este valor según sea necesario
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="filtro-wrapper">
    <button className="filtro-flecha izquierda" onClick={() => scroll('left')}>
      <FaChevronLeft />
    </button>
    <div className="filtro-container" ref={containerRef}>
      {tiposEstablecimientos.map(({ nombre, clave, icono }) => (
        <button
          key={clave}
          className={`filtro-boton ${filtrosSeleccionados.includes(clave) ? 'activo' : ''}`}
          onClick={() => toggleFiltro(clave)}
        >
          {icono} {nombre}
        </button>
      ))}
    </div>
    <button className="filtro-flecha derecha" onClick={() => scroll('right')}>
      <FaChevronRight />
    </button>
  </div>
  );
};

export default FiltroEstablecimientos;
