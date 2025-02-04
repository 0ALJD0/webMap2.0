// MapaDos.js
import React from 'react';
import { useEffect } from "react";
import { MapContainer, TileLayer,Marker, Popup , useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaUtensils  } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
    // Crear el icono con FaMapMarkerAlt de react-icons
    const customIcon = L.divIcon({
      className: "custom-icon",
      html: ReactDOMServer.renderToString(
        <div className="icon-background">
          <FaUtensils size={20} color="white" />
        </div>
      ),
      iconSize: [40, 50], // Ajustamos tamaño para el pin
      iconAnchor: [20, 50], // Ajustamos el punto de anclaje para que quede bien posicionado
    });
const MapaUno = ({ establecimientos, ubicacion}) => {

return (
  <MapContainer
    className="awa"
    zoomControl={false}
    center={[-0.95156069, -80.6914418]}
    zoom={13}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />

    {/* Componente para centrar el mapa cuando cambie "ubicacion" */}
    <CentrarMapa ubicacion={ubicacion} />

    {establecimientos.map((establecimiento) => (
      <Marker
        key={establecimiento.id}
        position={[parseFloat(establecimiento.latitud), parseFloat(establecimiento.longitud)]}
        icon={customIcon}
      >
        <Popup>
          <div className="mp-popup-content">
            <div className="mp-popup-section">
              <h2 className="mp-popup-title">Nombre</h2>
              <p className="mp-popup-text">{establecimiento.nombre}</p>
            </div>
            <div className="mp-popup-section">
              <h2 className="mp-popup-title">Dirección</h2>
              <p className="mp-popup-text">{establecimiento.direccion}</p>
            </div>
            <div className="mp-popup-section">
              <h2 className="mp-popup-title">Tipo</h2>
              <p className="mp-popup-text">{establecimiento.tipo}</p>
            </div>
          </div>
        </Popup>
      </Marker>
    ))}
  </MapContainer>
);
};

// Componente para cambiar la vista del mapa
const CentrarMapa = ({ ubicacion }) => {
const map = useMap();
//console.log(ubicacion);
useEffect(() => {
  if (ubicacion && ubicacion.length === 2) {
    map.setView([ubicacion[1], ubicacion[0]], 15); // Cambia el centro del mapa sin afectar el zoom
  }
}, [ubicacion, map]);

return null;
};

export default MapaUno;
