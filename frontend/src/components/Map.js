// src/components/Map.js
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap  } from 'react-leaflet';
import './css/Map.css'; 
import L from 'leaflet';
import 'leaflet-search';

  // Crear el icono con el emoji 🍽️
  const emojiIcon = L.divIcon({
    className: 'custom-icon',
    html: '<div class="icon-background">🍽️</div>',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

const MoverMapa = ({ zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (zoom) {
      map.flyTo([parseFloat(zoom.latitud), parseFloat(zoom.longitud)], 18, {
        duration: 1.5,
      });
    }
  }, [zoom, map]);

  return null;
};
const Map = ({ establecimientos, zoom }) => {

  return (
    <div className="map-container">
      <MapContainer center={[-0.95156069, -80.6914418]} zoom={13} zoomControl={false} className="leaflet-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MoverMapa zoom={zoom} />
        {establecimientos.map((establecimiento) => (
          <Marker
            key={establecimiento.id}
            position={[parseFloat(establecimiento.latitud), parseFloat(establecimiento.longitud)]}
            icon={emojiIcon}
            
          >
            <Popup>
            <div className="mp-popup-content" >
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
