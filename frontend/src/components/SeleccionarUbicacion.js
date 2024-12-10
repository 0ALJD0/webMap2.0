// src/components/SeleccionarUbicacion.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
  // Crear el icono con el emoji 🍽️
  const emojiIcon = L.divIcon({
    className: 'custom-icon',
    html: '<div class="icon-background">🍽️</div>',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

const SeleccionarUbicacion = ({ onUbicacionSeleccionada, onCancel }) => {
  const [posicion, setPosicion] = useState(null);

  const ManejadorMapa = () => {
    useMapEvents({
      click: (e) => {
        setPosicion(e.latlng);
      },
    });
    return posicion ? <Marker icon={emojiIcon} position={posicion} /> : null;
  };

  const handleConfirmar = () => {
    if (posicion) {
      onUbicacionSeleccionada(posicion.lat, posicion.lng);
    }
  };

  return (
    <div className="map-popup">
      <MapContainer center={[-0.95, -80.7]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ManejadorMapa />
      </MapContainer>
      <div className="map-buttons">
        <button className="ce-button-primary" onClick={handleConfirmar}>Confirmar</button>
        <button className="ce-button-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
};

export default SeleccionarUbicacion;
