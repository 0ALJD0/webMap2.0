import React, { useState } from 'react';
import { FaStarHalfStroke } from 'react-icons/fa6'; // Importar el icono
import './css/Estrellas.css'; // Archivo de estilos para las estrellas

const Estrellas = ({ puntuacion, onCambioPuntuacion }) => {
  const [puntuacionHover, setPuntuacionHover] = useState(0);

  return (
    <div className="estrellas-container">
      {[1, 2, 3, 4, 5].map((estrella) => (
        <span key={estrella} className="estrella-wrapper">
            <FaStarHalfStroke
            className={`estrella ${
                estrella <= (puntuacionHover || puntuacion) ? 'llena' : 'vacia'
            }`}
            onClick={() => onCambioPuntuacion(estrella)}
            onMouseEnter={() => setPuntuacionHover(estrella)}
            onMouseLeave={() => setPuntuacionHover(0)}
            />
        </span>
      ))}
    </div>
  );
};

export default Estrellas;