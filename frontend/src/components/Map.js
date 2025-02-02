// src/components/Map.js
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap  } from 'react-leaflet';
import UbicacionActual from './UbicacionActual'
import './css/Map.css'; 
import L from 'leaflet';
import 'leaflet-search';
import "leaflet-routing-machine";

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

const Ruta = ({ rutas, onLimpiarRuta  }) => {
  const map = useMap(); // Obtiene la referencia del mapa actual

  useEffect(() => {
    if (map && rutas?.desde && rutas?.hacia) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(parseFloat(rutas.desde.lat), parseFloat(rutas.desde.lng)),
          L.latLng(parseFloat(rutas.hacia.lat), parseFloat(rutas.hacia.lng)),
        ],
        routeWhileDragging: true,
        collapsible: true, // Permite colapsar el panel de instrucciones
        show: true, // Muestra el panel de instrucciones
        addWaypoints: false, // Evita agregar puntos intermedios
        draggableWaypoints: false, // Evita arrastrar los puntos de la ruta
        fitSelectedRoutes: true, // Ajusta el mapa a la ruta seleccionada
        lineOptions: {
          styles: [{ color: '#0078A8', opacity: 0.7, weight: 5 }], // Estilo de la línea de la ruta
        },
        createMarker: () => null, // No mostrar marcadores en los puntos de la ruta
      }).addTo(map);
      // Agregar una clase personalizada al panel de instrucciones
      const container = routingControl.getContainer();
      if (container) {
        container.classList.add('custom-instructions');
        const limpiarButton = document.createElement('button');
        limpiarButton.innerText = 'Limpiar ruta';
        limpiarButton.className = 'limpiar-ruta-button';
        limpiarButton.onclick = onLimpiarRuta;
        container.appendChild(limpiarButton);
      }

      // Guardar la instancia del control de ruta para limpiarlo después
      map.routingControl = routingControl;
      return () => {
        map.removeControl(routingControl);
        delete map.routingControl;
      };
    }
  }, [map, rutas, onLimpiarRuta]);

  return null; // No renderiza nada, solo agrega la ruta al mapa
};
const Map = ({ establecimientos, zoom, rutas, onLimpiarRuta  }) => {

  return (
    <div className="map-container">
      <MapContainer center={[-0.95156069, -80.6914418]} zoom={13} zoomControl={false} className="leaflet-map" >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />


        <MoverMapa zoom={zoom} />
        <Ruta rutas={rutas} onLimpiarRuta ={onLimpiarRuta} />
        <UbicacionActual />
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
