import { useState } from "react";
import './css/BarraBusqueda.css';
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Ícono de la "X"
import { TbArrowRampRight } from "react-icons/tb";


const BarraBusqueda = ({ establecimientos, onSeleccionarEstablecimiento, onCalcularRuta  }) => {
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [indiceActivo, setIndiceActivo] = useState(-1);
  const [mostrarMenuRuta, setMostrarMenuRuta] = useState(false);
  const [desde, setDesde] = useState("");
  const [hacia, setHacia] = useState("");
  const [desdeLat, setDesdeLat]=useState("");
  const [desdeLng, setDesdeLng]=useState("");

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

  const manejarSeleccion = (establecimiento) => {
    setBusqueda(establecimiento.nombre);
    setSugerencias([]);
    onSeleccionarEstablecimiento(establecimiento);
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
              console.log(latString,lngString);
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
          <IoClose className="icono-limpiar" onClick={limpiarBusqueda} />
        )}
        {/* Botón "¿Cómo llegar?" */}
        <TbArrowRampRight className="boton-como-llegar" onClick={() => setMostrarMenuRuta(!mostrarMenuRuta)}/>
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
          <input
            type="text"
            placeholder="Desde..."
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
          <button className="boton-ubicacion-actual" onClick={obtenerUbicacionActual}>📍 Usar ubicación actual</button>

          <input
            type="text"
            placeholder="Hacia..."
            value={hacia}
            onChange={(e) => setHacia(e.target.value)}
          />

          <button className="boton-calcular-ruta" onClick={manejarCalcularRuta}>Ir</button>
        </div>
      )}
    </div>
  );
};

export default BarraBusqueda;