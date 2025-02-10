import { useState } from "react";
import './css/BarraBusqueda.css';
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Ícono de la "X"
import { TbArrowRampRight } from "react-icons/tb";
import { PiBroom } from "react-icons/pi";


const BarraBusqueda = ({ establecimientos, onSeleccionarEstablecimiento, onCalcularRuta  }) => {
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [indiceActivo, setIndiceActivo] = useState(-1);
  const [mostrarMenuRuta, setMostrarMenuRuta] = useState(false);
  const [desde, setDesde] = useState("");
  const [hacia, setHacia] = useState("");
  const [desdeLat, setDesdeLat]=useState("");
  const [desdeLng, setDesdeLng]=useState("");

  // Estados para las sugerencias de "Desde" y "Hacia"
  const [sugerenciasDesde, setSugerenciasDesde] = useState([]);
  const [sugerenciasHacia, setSugerenciasHacia] = useState([]);
  const [indiceActivoDesde, setIndiceActivoDesde] = useState(-1);
  const [indiceActivoHacia, setIndiceActivoHacia] = useState(-1);

  const manejarCambio = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);

    if (valor.trim() === "") {
      setSugerencias([]);
      return;
    }

    const filtrados = establecimientos.filter((est) =>
      est.nombre.toLowerCase().includes(valor.toLowerCase())
    );
    setSugerencias(filtrados);
    setIndiceActivo(-1);
  };
  // Función para manejar cambios en el input "Desde"
  const manejarCambioDesde = (e) => {
    const valor = e.target.value;
    setDesde(valor);

    if (valor.trim() === "") {
      setSugerenciasDesde([]);
      return;
    }

    const filtrados = establecimientos.filter((est) =>
      est.nombre.toLowerCase().includes(valor.toLowerCase())
    );
    setSugerenciasDesde(filtrados);
    setIndiceActivoDesde(-1);
  };

  // Función para manejar cambios en el input "Hacia"
  const manejarCambioHacia = (e) => {
    const valor = e.target.value;
    setHacia(valor);

    if (valor.trim() === "") {
      setSugerenciasHacia([]);
      return;
    }

    const filtrados = establecimientos.filter((est) =>
      est.nombre.toLowerCase().includes(valor.toLowerCase())
    );
    setSugerenciasHacia(filtrados);
    setIndiceActivoHacia(-1);
  };


  const manejarSeleccion = (establecimiento) => {
    setBusqueda(establecimiento.nombre);
    setSugerencias([]);
    onSeleccionarEstablecimiento(establecimiento);
  };

  // Función para manejar la selección de una sugerencia en el input "Desde"
  const manejarSeleccionDesde = (establecimiento) => {
    setDesde(establecimiento.nombre);
    setSugerenciasDesde([]);
  };

  // Función para manejar la selección de una sugerencia en el input "Hacia"
  const manejarSeleccionHacia = (establecimiento) => {
    setHacia(establecimiento.nombre);
    setSugerenciasHacia([]);
  };

  const manejarTecla = (e) => {
    if (e.key === "ArrowDown" && indiceActivo < sugerencias.length - 1) {
      setIndiceActivo(indiceActivo + 1);
    } else if (e.key === "ArrowUp" && indiceActivo > 0) {
      setIndiceActivo(indiceActivo - 1);
    } else if (e.key === "Enter") {
        

        if (indiceActivo >= 0) {
          manejarSeleccion(sugerencias[indiceActivo]);
        } else {
          // Buscar coincidencia exacta en la lista de establecimientos
          const encontrado = establecimientos.find(
            (est) => est.nombre.toLowerCase() === busqueda.toLowerCase()
          );
          if (encontrado) {
            manejarSeleccion(encontrado);
          }
        }
    }
  };

    // Función para manejar teclas en el input "Desde"
    const manejarTeclaDesde = (e) => {
      if (e.key === "ArrowDown" && indiceActivoDesde < sugerenciasDesde.length - 1) {
        setIndiceActivoDesde(indiceActivoDesde + 1);
      } else if (e.key === "ArrowUp" && indiceActivoDesde > 0) {
        setIndiceActivoDesde(indiceActivoDesde - 1);
      } else if (e.key === "Enter") {
        if (indiceActivoDesde >= 0) {
          manejarSeleccionDesde(sugerenciasDesde[indiceActivoDesde]);
        } else {
          const encontrado = establecimientos.find(
            (est) => est.nombre.toLowerCase() === desde.toLowerCase()
          );
          if (encontrado) {
            manejarSeleccionDesde(encontrado);
          }
        }
      }
    };
  
  // Función para manejar teclas en el input "Hacia"
  const manejarTeclaHacia = (e) => {
    if (e.key === "ArrowDown" && indiceActivoHacia < sugerenciasHacia.length - 1) {
      setIndiceActivoHacia(indiceActivoHacia + 1);
    } else if (e.key === "ArrowUp" && indiceActivoHacia > 0) {
      setIndiceActivoHacia(indiceActivoHacia - 1);
    } else if (e.key === "Enter") {
      if (indiceActivoHacia >= 0) {
        manejarSeleccionHacia(sugerenciasHacia[indiceActivoHacia]);
      } else {
        const encontrado = establecimientos.find(
          (est) => est.nombre.toLowerCase() === hacia.toLowerCase()
        );
        if (encontrado) {
          manejarSeleccionHacia(encontrado);
        }
      }
    }
  };
  
  const limpiarBusqueda = () => {
    setBusqueda("");
    setSugerencias([]);
  };
    // Obtiene la ubicación actual del usuario
    const obtenerUbicacionActual = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setDesde("Ubicación actual");
              const latString = position.coords.latitude;
              const lngString = position.coords.longitude;
              setDesdeLat(latString.toString());
              setDesdeLng(lngString.toString());
            },
            (error) => {
              console.error("Error obteniendo ubicación:", error);
              alert("No se pudo obtener la ubicación actual.");
            },
            {
                enableHighAccuracy: true, // Solicitar alta precisión
                timeout: 5000, // Tiempo máximo de espera
                maximumAge: 0 // No usar caché de ubicación
              }
          );
        } else {
          alert("Geolocalización no soportada en este navegador.");
        }
      };
    
      const manejarCalcularRuta = () => {
        const establecimientoHacia = establecimientos.find((est) => est.nombre === hacia);
        const establecimientoDesde = establecimientos.find((est) => est.nombre ===desde); 
        if (!desde || !establecimientoHacia) {
          alert("Por favor, escriba ambos puntos.");
          return;
        }
        if(desde ===  "Ubicación actual"){
            onCalcularRuta({
                desde: {lat:desdeLat,lng:desdeLng},
                hacia: { lat: establecimientoHacia.latitud, lng: establecimientoHacia.longitud },
              });
        } else {
            onCalcularRuta({
                desde: {lat:establecimientoDesde.latitud, lng:establecimientoDesde.longitud},
                hacia: { lat: establecimientoHacia.latitud, lng: establecimientoHacia.longitud },
              });
        }

      };
      const limpiarRuta = () => {
        setDesde(""); // Limpia el estado local
        setHacia(""); // Limpia el estado local
        onCalcularRuta(null); // Notifica al padre (si es necesario)
      };

  return (
    <div className="contenedor-barra-busqueda">
      {/* Barra de búsqueda principal */}
      <div className="barra-busqueda">
        <FaSearch className="icono-busqueda" />
        <input
          type="text"
          placeholder="Escribe el nombre de un establecimiento"
          value={busqueda}
          onChange={manejarCambio}
          onKeyDown={manejarTecla}
        />
        {busqueda && (
          <IoClose className="icono-limpiar"  onClick={limpiarBusqueda} ></IoClose>
        )}
        {/* Botón "¿Cómo llegar?" */}
        <TbArrowRampRight className="boton-como-llegar" title="¿Como llegar?" onClick={() => setMostrarMenuRuta(!mostrarMenuRuta)}/>
        {sugerencias.length > 0 && (
          <div className="sugerencias-lista">
            {sugerencias.map((establecimiento, index) => (
              <div
                key={establecimiento.id}
                className={`sugerencia ${index === indiceActivo ? "activa" : ""}`}
                onMouseEnter={() => setIndiceActivo(index)}
                onClick={() => manejarSeleccion(establecimiento)}
              >
                {establecimiento.nombre}
              </div>
            ))}
          </div>
        )}
      </div>



      {/* Menú desplegable con inputs "Desde" y "Hacia" */}
      {mostrarMenuRuta && (
        <div className="menu-ruta">
          <div className="input-contenedor">
            <input
              type="text"
              placeholder="Desde..."
              value={desde}
              onChange={manejarCambioDesde}
              onKeyDown={manejarTeclaDesde}
            />
            {sugerenciasDesde.length > 0 && (
              <div className="sugerencias-lista-desde">
                {sugerenciasDesde.map((establecimiento, index) => (
                  <div
                    key={establecimiento.id}
                    className={`sugerencia ${index === indiceActivoDesde ? "activa" : ""}`}
                    onMouseEnter={() => setIndiceActivoDesde(index)}
                    onClick={() => manejarSeleccionDesde(establecimiento)}
                  >
                    {establecimiento.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="boton-ubicacion-actual" onClick={obtenerUbicacionActual}>
            📍 Usar ubicación actual
          </button>

          <div className="input-contenedor">
            <input
              type="text"
              placeholder="Hacia..."
              value={hacia}
              onChange={manejarCambioHacia}
              onKeyDown={manejarTeclaHacia}
            />
            {sugerenciasHacia.length > 0 && (
              <div className="sugerencias-lista-hacia">
                {sugerenciasHacia.map((establecimiento, index) => (
                  <div
                    key={establecimiento.id}
                    className={`sugerencia ${index === indiceActivoHacia ? "activa" : ""}`}
                    onMouseEnter={() => setIndiceActivoHacia(index)}
                    onClick={() => manejarSeleccionHacia(establecimiento)}
                  >
                    {establecimiento.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>
          {(desde || hacia) && (
            <div className="boton-limpiar" onClick={limpiarRuta}>
              <PiBroom className="icono-limpiar" />
              <span>Limpiar</span>
            </div>
          )}

          <button className="boton-calcular-ruta" onClick={manejarCalcularRuta}>Ir</button>
        </div>
      )}
    </div>
  );
};

export default BarraBusqueda;