import { useState } from "react";
import './css/BarraBusqueda.css';
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Ícono de la "X"

const BarraBusqueda = ({ establecimientos, onSeleccionarEstablecimiento }) => {
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [indiceActivo, setIndiceActivo] = useState(-1);

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

  return (
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
  );
};

export default BarraBusqueda;