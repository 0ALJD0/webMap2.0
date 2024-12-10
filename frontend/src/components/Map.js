// src/components/Map.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import './css/Map.css'; 
import L from 'leaflet';
  // Crear el icono con el emoji 🍽️
  const emojiIcon = L.divIcon({
    className: 'custom-icon',
    html: '<div class="icon-background">🍽️</div>',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
const Map = ({ establecimientos, onEstablecimientoSelect }) => {
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null);

  const handleEstablecimientoClick = (establecimiento) => {
    console.log('Establecimiento seleccionado:', establecimiento);
    setSelectedEstablecimiento(establecimiento);
    onEstablecimientoSelect(establecimiento); // Llamar a la función del padre para actualizar la tabla
  };
  /*<ZoomControl position="bottomright" />*/
  return (
    <div className="map-container">
      <MapContainer center={[-0.95156069, -80.6914418]} zoom={13} className="leaflet-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {establecimientos.map((establecimiento) => (
          <Marker
            key={establecimiento.id}
            position={[parseFloat(establecimiento.latitud), parseFloat(establecimiento.longitud)]}
            icon={emojiIcon}
            
          >
            <Popup>
            <div className="mp-popup-content" onClick={() => handleEstablecimientoClick(establecimiento)}>
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
    </div>
  );
};

export default Map;
