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
// Configuración de filtros adicionales
const filtrosAdicionales = {
  Restaurante: {
    atributo: 'numero_cubiertos',
    icono: <FaUtensils />, // Ícono representativo
    opciones: [1, 2, 3, 4, 5].map(num => ({
      clave: num,
      texto: `${num} tenedor${num !== 1 ? 'es' : ''}`
    }))
  },
  Cafetería: {
    atributo: 'numero_taza',
    icono: <FaCoffee />, // Ícono representativo
    opciones: [1, 2].map(num => ({
      clave: num,
      texto: `${num} taza${num !== 1 ? 's' : ''}`
    }))
  },
  Bar: {
    atributo: 'numero_copas',
    icono: <FaGlassCheers />, // Ícono representativo
    opciones: [1, 2, 3].map(num => ({
      clave: num,
      texto: `${num} copa${num !== 1 ? 's' : ''}`
    }))
  },
  Discoteca: {
    atributo: 'numero_copas',
    icono: <FaGlassCheers />, // Ícono representativo
    opciones: [1, 2, 3].map(num => ({
      clave: num,
      texto: `${num} copa${num !== 1 ? 's' : ''}`
    }))
  }
};
const FiltroEstablecimientos = ({ onFiltrar }) => {
  const [filtrosTipo, setFiltrosTipo] = useState(null);
  const [filtrosValoracion, setFiltrosValoracion] = useState([]);
  const [filtroAdicional, setFiltroAdicional] = useState(null);
  const tipoContainerRef = useRef(null);
  const valoracionContainerRef = useRef(null);
  const adicionalContainerRef = useRef(null);

  // Manejar selección y deselección de filtros de tipo
  const toggleFiltroTipo = (clave) => {
    let nuevosFiltros = filtrosTipo === clave ? null : clave;
    setFiltrosTipo(nuevosFiltros);
    setFiltroAdicional(null); // Resetear filtro adicional al cambiar el tipo
    onFiltrar({ tipos: nuevosFiltros ? [nuevosFiltros] : [], valoraciones: filtrosValoracion, adicional: null });
  };

  // Manejar selección y deselección de filtros de valoración
  const toggleFiltroValoracion = (clave) => {
    let nuevosFiltros = filtrosValoracion.includes(clave)
      ? filtrosValoracion.filter(f => f !== clave)
      : [...filtrosValoracion, clave];
    setFiltrosValoracion(nuevosFiltros);
    onFiltrar({ tipos: filtrosTipo ? [filtrosTipo] : [], valoraciones: nuevosFiltros, adicional: filtroAdicional });
  };

  // Manejar selección de filtro adicional
  const toggleFiltroAdicional = (clave) => {
    const nuevoFiltro = filtroAdicional === clave ? null : clave;
    setFiltroAdicional(nuevoFiltro);
    onFiltrar({ tipos: filtrosTipo ? [filtrosTipo] : [], valoraciones: filtrosValoracion, adicional: nuevoFiltro });
  };

  // Desplazamiento horizontal
  const scroll = (ref, direction) => {
    const container = ref.current;
    const scrollAmount = 200; // Ajusta este valor según sea necesario
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
    // Renderizar filtros adicionales
    const renderFiltroAdicional = () => {
      if (!filtrosTipo || !filtrosAdicionales[filtrosTipo]) return null;
  
      const {icono, opciones } = filtrosAdicionales[filtrosTipo];
  
      return (
        <div className="filtro-adicional-wrapper">
        <button className="filtro-flecha" onClick={() => scroll(adicionalContainerRef, 'left')}>
          <FaChevronCircleLeft />
        </button>
        <div className="filtro-container" ref={adicionalContainerRef}>
          {opciones.map(({ clave, texto }) => (
            <button
              key={clave}
              className={`filtro-boton ${filtroAdicional === clave ? 'activo' : ''}`}
              onClick={() => toggleFiltroAdicional(clave)}
            >
              {icono} {texto}
            </button>
          ))}
        </div>
        <button className="filtro-flecha" onClick={() => scroll(adicionalContainerRef, 'right')}>
          <FaChevronCircleRight />
        </button>
      </div>
    );
    };

  return (
    <div>
      {/* Filtro de tipo de establecimiento */}
      <div className="filtro-tipos-wrapper">
        <button className="filtro-flecha" onClick={() => scroll(tipoContainerRef, 'left')}>
          <FaChevronCircleLeft  />
        </button>
        <div className="filtro-container" ref={tipoContainerRef}>
          {tiposEstablecimientos.map(({ nombre, clave, icono }) => (
            <button
              key={clave}
              className={`filtro-boton ${filtrosTipo === clave ? 'activo' : ''}`}
              onClick={() => toggleFiltroTipo(clave)}
            >
              {icono} {nombre}
            </button>
          ))}
        </div>
        <button className="filtro-flecha" onClick={() => scroll(tipoContainerRef, 'right')}>
          <FaChevronCircleRight />
        </button>
      </div>

      {/* Filtro adicional (tenedores, tazas, copas) */}
      {renderFiltroAdicional()}

      {/* Filtro de valoración */}
      <div className="filtro-valoraciones-wrapper">
        <button className="filtro-flecha" onClick={() => scroll(valoracionContainerRef, 'left')}>
          <FaChevronCircleLeft  />
        </button>
        <div className="filtro-container" ref={valoracionContainerRef}>
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
        <button className="filtro-flecha" onClick={() => scroll(valoracionContainerRef, 'right')}>
          <FaChevronCircleRight />
        </button>
      </div>
    </div>
  );
};

export default FiltroEstablecimientos;
