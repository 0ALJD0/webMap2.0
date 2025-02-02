import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import EstablecimientosTabla from '../components/EstablecimientosTabla';
import AgenteVirtual from '../components/AgenteVirtual';
import BarraBusqueda from '../components/BarraBusqueda';
import FiltroEstablecimientos from '../components/FiltroEstablecimientos';
import { fetchEstablecimientos } from '../services/api';
import './css/HomePage.css';

const HomePage = () => {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [tablaEstablecimiento, setTablaEstablecimiento] = useState(null);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [plegadoTabla, setPlegadoTabla] = useState(false);
  const [mostrarAgente, setMostrarAgente] = useState(false);
  const [plegadoAgente, setPlegadoAgente] = useState(false);
  const [ruta, setRuta] = useState([]);
  const [establecimientosFiltrados, setEstablecimientosFiltrados] = useState([]);
  useEffect(() => {
    const fetchEstablecimientosData = async () => {
      try {
        const data = await fetchEstablecimientos();
        setEstablecimientos(data);  // Actualiza el estado con los establecimientos obtenidos
        setEstablecimientosFiltrados(data);  // Inicializa los establecimientos filtrados con todos los establecimientos
      } catch (error) {
        console.error('Error fetching establecimientos:', error);
      }
    };

    fetchEstablecimientosData(); // Llama a la función para obtener los establecimientos al cargar la página
  }, []);

  const handleEstablecimientoSelect = (establecimiento) => {
    setTablaEstablecimiento(establecimiento);
    setMostrarTabla(true);
    setPlegadoTabla(false);
  };
  const handleCerrarTabla = () => {
    setPlegadoTabla(true);
    setTimeout(() => setMostrarTabla(false), 300);  // Espera el tiempo de la transición
  };

  const handleCerrarAgente = () => {
    setPlegadoAgente(true);
    setTimeout(() => setMostrarAgente(false), 300);  // Espera el tiempo de la transición
  };

  const handleDesplegarAgente = () => {
    setMostrarAgente(true);
    setTimeout(() => setPlegadoAgente(false), 100); // Pequeño retraso para permitir la animación
  };

  const handleRuta=(rutas)=>{
    setRuta(rutas);
  }
  const limpiarRuta=()=>{
    setRuta([]);
  }
  // Función para actualizar establecimientos filtrados
  const handleFiltrar = (filtrosSeleccionados) => {
    console.log(filtrosSeleccionados);
    if (filtrosSeleccionados.length === 0) {
      setEstablecimientosFiltrados(establecimientos);
    } else {
      setEstablecimientosFiltrados(
        establecimientos.filter(e => filtrosSeleccionados.includes(e.tipo))
      );
    }
  };
 /* <button className="hp-plegar-boton1" onClick={() => setPlegadoAgente(!plegadoAgente)}>
  {plegadoAgente ? '↑' : '↓'}
  </button>
    elemento no implmentado por bugs***
  */

  return (
    <div className="hp-homepage">
      <div className="hp-main-content">
        <BarraBusqueda establecimientos={establecimientos} onSeleccionarEstablecimiento={handleEstablecimientoSelect} onCalcularRuta={handleRuta}/>
        <FiltroEstablecimientos onFiltrar={handleFiltrar} />
        <Map establecimientos={establecimientosFiltrados} zoom={tablaEstablecimiento} rutas={ruta} onLimpiarRuta={limpiarRuta}/>
        {mostrarTabla && (
          <div className={`hp-establecimientos-tabla ${plegadoTabla ? 'plegado' : 'desplegado'}`}>
            <button className="hp-plegar-boton" onClick={() => setPlegadoTabla(!plegadoTabla)}>
              {plegadoTabla ? '→' : '←'}
            </button>
            {!plegadoTabla && (
              <div className="hp-tabla-contenido">
                <EstablecimientosTabla establecimiento={tablaEstablecimiento} />
              </div>
            )}
          </div>
        )}
        {mostrarAgente && (
          <div className={`hp-agente-virtual ${plegadoAgente ? 'plegado' : 'desplegado'}`}>

            <div className="contenido-agente">
              {!plegadoAgente && (
                <div>
                    <button className="hp-cerrar-boton1" onClick={handleCerrarAgente}>X</button>
                    <AgenteVirtual />
                </div>
                )}
            </div>

          </div>
        )}
        {!mostrarAgente && (
          <div className="hp-agente-virtual-boton"onClick={handleDesplegarAgente}>
            <div className="hp-agente-logo">
              <img src="./logo_agente.png" alt="Agente Virtual" />
              <div className="hp-agente-mensaje">¿Tienes dudas? ¡Pregúntame!</div>
              <div className="hp-agente-titulo">Agente Virtual</div> {/* Mensaje debajo del logo */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default HomePage;