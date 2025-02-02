import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Map from '../components/Map';
import EstablecimientosTabla from '../components/EstablecimientosTabla';
import AgenteVirtual from '../components/AgenteVirtual';
import BarraBusqueda from '../components/BarraBusqueda';
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

  useEffect(() => {
    const fetchEstablecimientosData = async () => {
      try {
        const data = await fetchEstablecimientos();
        setEstablecimientos(data);  // Actualiza el estado con los establecimientos obtenidos
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
    console.log(rutas);
  }
 /* <button className="hp-plegar-boton1" onClick={() => setPlegadoAgente(!plegadoAgente)}>
  {plegadoAgente ? '↑' : '↓'}
  </button>
    elemento no implmentado por bugs***
  */

  return (
    <div className="hp-homepage">
      <header className="hp-header">
        <Header />
      </header>
      <div className="hp-main-content">
        <BarraBusqueda establecimientos={establecimientos} onSeleccionarEstablecimiento={handleEstablecimientoSelect} onCalcularRuta={handleRuta}/>
        <Map establecimientos={establecimientos} zoom={tablaEstablecimiento} rutas={ruta}/>
        {mostrarTabla && (
          <div className={`hp-establecimientos-tabla ${plegadoTabla ? 'plegado' : 'desplegado'}`}>
            <button className="hp-plegar-boton" onClick={() => setPlegadoTabla(!plegadoTabla)}>
              {plegadoTabla ? '→' : '←'}
            </button>
            {!plegadoTabla && (
              <div className="hp-tabla-contenido">
                <button className="hp-cerrar-boton" onClick={handleCerrarTabla}>X</button>
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
                    <button className="hp-cerrar-boton" onClick={handleCerrarAgente}>X</button>
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