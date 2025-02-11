import { useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { /*useEffect,*/ useState } from 'react';
import { RiUserLocationFill } from "react-icons/ri";
import { MdMyLocation } from "react-icons/md";
import ReactDOMServer from "react-dom/server";
import './css/UbicacionActual.css';


const UbicacionActual = () => {
  const map = useMap();
  const [ubicacion, setUbicacion] = useState(null);
  const [ubicacionActiva, setUbicacionActiva] = useState(false);

  // Icono para el marcador de ubicación actual
  const ubicacionIcon = L.divIcon({
    className: 'icon-ubicacion',
    html: ReactDOMServer.renderToString(
        <div className='icono-ubicacion'>
            <RiUserLocationFill  color='#007bff'/>
        </div>
    ),
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  // Obtener la ubicación actual
  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUbicacion({ lat: latitude, lng: longitude });
          map.flyTo([latitude, longitude], 18); // Centrar el mapa en la ubicación actual
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          alert("No se pudo obtener la ubicación actual.");
        },
        {
          enableHighAccuracy: true, // Alta precisión
          timeout: 5000, // Tiempo máximo de espera
          maximumAge: 0, // No usar caché
        }
      );
    } else {
      alert("Geolocalización no soportada en este navegador.");
    }
  };
  const handleClick = () => {
    if (!ubicacionActiva) {
      obtenerUbicacion();
    } else {
      limpiarUbicacion();
    }
    setUbicacionActiva(!ubicacionActiva); // Cambia el estado
  };
  // Limpiar el marcador de ubicación actual
  const limpiarUbicacion = () => {
    setUbicacion(null);
  };

  return (
    <div className="ubicacion-actual-control">
      <MdMyLocation  title={ubicacionActiva ? "Limpiar ubicación" : "Ver mi ubicación"} className='ubicacion-actual-boton' onClick={handleClick}></MdMyLocation>
      {ubicacion && (
        <Marker position={[ubicacion.lat, ubicacion.lng]} icon={ubicacionIcon}>
          <Popup>Tu ubicación actual</Popup>
        </Marker>
      )}
    </div>
  );
};
export default UbicacionActual;