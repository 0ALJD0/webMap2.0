// src/components/Map.js
import React, { useState, useEffect, /*useRef*/ } from 'react';
import { MapContainer, TileLayer, Marker, /*ZoomControl,*/ useMap  } from 'react-leaflet';
import UbicacionActual from './UbicacionActual'
import { FaMapMarkerAlt } from 'react-icons/fa'; // Ícono para los marcadores
import './css/Map.css'; 
import L from 'leaflet';
import 'leaflet-search';
import "leaflet-routing-machine";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
// Importar el archivo de idioma en español

import 'leaflet.locatecontrol'; // Importa el plugin
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'; // Importa los estilos
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
      // Crear íconos personalizados para los marcadores
      const iconoInicio = L.divIcon({
        className: 'custom-marker-inicio',
        html: ReactDOMServer.renderToString(
          <div className="marker-inicio">
            <FaMapMarkerAlt size={24} color="#0078A8" /> {/* Ícono de inicio */}
          </div>
        ),
        iconSize: [30, 30], // Tamaño del ícono
        iconAnchor: [15, 30], // Punto de anclaje
      });

      const iconoFin = L.divIcon({
        className: 'custom-marker-fin',
        html: ReactDOMServer.renderToString(
          <div className="marker-fin">
            <FaMapMarkerAlt size={24} color="#FF0000" /> {/* Ícono de fin */}
          </div>
        ),
        iconSize: [30, 30], // Tamaño del ícono
        iconAnchor: [15, 30], // Punto de anclaje
      });
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
        createMarker: (i, waypoint, n) => {
          // Personalizar los marcadores de inicio y fin
          if (i === 0) {
            return L.marker(waypoint.latLng, { icon: iconoInicio }); // Marcador de inicio
          } else if (i === n - 1) {
            return L.marker(waypoint.latLng, { icon: iconoFin }); // Marcador de fin
          }
          return null; // No mostrar marcadores para puntos intermedios
        },
        language: 'es', // Configurar el idioma en español
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
const Map = ({ establecimientos, zoom, rutas, onLimpiarRuta, seleccionarEst  }) => {
  const [mostrarMarcadores, setMostrarMarcadores] = useState(true); // Estado para controlar la visibilidad de los marcadores

  // Efecto para ocultar/mostrar marcadores cuando cambia la ruta
  useEffect(() => {
    if (rutas?.desde && rutas?.hacia) {
      setMostrarMarcadores(false); // Ocultar marcadores cuando hay una ruta
    } else {
      setMostrarMarcadores(true); // Mostrar marcadores cuando no hay ruta
    }
  }, [rutas]);

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
        {/* Mostrar marcadores solo si mostrarMarcadores es true */}
        {mostrarMarcadores &&
          establecimientos.map((establecimiento) => (
            <Marker
              key={establecimiento.id}
              position={[parseFloat(establecimiento.latitud), parseFloat(establecimiento.longitud)]}
              icon={customIcon}
              eventHandlers={{
                click: () => seleccionarEst(establecimiento),
              }}
            ></Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default Map;
