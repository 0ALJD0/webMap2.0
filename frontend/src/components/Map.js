// src/components/Map.js
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap  } from 'react-leaflet';
import './css/Map.css'; 
import L from 'leaflet';
import 'leaflet-search';
//import 'leaflet-search/dist/leaflet-search.min.css';


// Componente para añadir la barra de búsqueda
const SearchControl = ({ establecimientos }) => {
  const map = useMap();
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchRef.current) {
      map.removeControl(searchRef.current);
    }

    const markersLayer = L.layerGroup(
      establecimientos.map((establecimiento) => {
        const marker = L.marker(
          [parseFloat(establecimiento.latitud), parseFloat(establecimiento.longitud)],
          { icon: emojiIcon }
        ).bindPopup(`
          <div>
            <h3>${establecimiento.nombre}</h3>
            <p><b>Dirección:</b> ${establecimiento.direccion}</p>
            <p><b>Tipo:</b> ${establecimiento.tipo}</p>
          </div>
        `);
        marker.options.title = establecimiento.nombre;
        return marker;
      })
    );

    markersLayer.addTo(map);

    searchRef.current = new L.Control.Search({
      layer: markersLayer,
      propertyName: 'title',
      zoom: 15,
      marker: false,
      moveToLocation: (latlng, title, map) => {
        map.setView(latlng, 15);
      },
      collapsed: false, // Hace que la barra de búsqueda siempre esté visible
      textPlaceholder: "Buscar establecimiento...",
      textErr: "No encontrado",
    });

    searchRef.current.addTo(map);

    // Agregar clase personalizada para modificar el estilo
    const searchContainer = searchRef.current.getContainer();
    searchContainer.classList.add("custom-search-control");

    return () => {
      if (searchRef.current) {
        map.removeControl(searchRef.current);
      }
    };
  }, [establecimientos, map]);

  return null;
};

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
            <div className="mp-popup-content" onMouseUp={() => {console.log('Establecimiento:', establecimiento); handleEstablecimientoClick(establecimiento);
}}>
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
                {/* Añadir el control de búsqueda */}
                <SearchControl establecimientos={establecimientos} />ola
      </MapContainer>
    </div>
  );
};

export default Map;
