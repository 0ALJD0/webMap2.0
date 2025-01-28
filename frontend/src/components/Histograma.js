//Componente Hoistograma.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { obtenerDatos } from '../services/api';
import './css/Histograma.css';
// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Histograma = () => {
  const [datos, setDatos] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [histogramaData, setHistogramaData] = useState(null);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Histograma de la categoría: ${categoriaSeleccionada}`,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { datos, categoriasUnicas, categoriaSeleccionada } = await obtenerDatos();
        setDatos(datos);
        setCategorias(categoriasUnicas);
        setCategoriaSeleccionada(categoriaSeleccionada);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!categoriaSeleccionada || !datos[categoriaSeleccionada]) return;

    const datosCategoria = datos[categoriaSeleccionada];
        // Crear un mapa para resumir las frecuencias por mes
        const frecuenciaPorMes = {};
        datosCategoria.forEach((item) => {
          const fecha = new Date(item.periodo); // Convertir a objeto Date
          const mesAnio = `${fecha.toLocaleString('es-ES', { month: 'long' })} ${fecha.getFullYear()}`; // Mes Año
          if (!frecuenciaPorMes[mesAnio]) {
            frecuenciaPorMes[mesAnio] = {};
          }
          if (!frecuenciaPorMes[mesAnio][item.caracteristica]) {
            frecuenciaPorMes[mesAnio][item.caracteristica] = 0;
          }
          frecuenciaPorMes[mesAnio][item.caracteristica] += item.frecuencia; // Sumar frecuencia
        });
    
        // Crear las etiquetas (meses) y los datasets
        const periodos = Object.keys(frecuenciaPorMes).sort(
          (a, b) => new Date(a) - new Date(b) // Ordenar por fecha
        );
        const caracteristicas = [...new Set(datosCategoria.map((item) => item.caracteristica))];
    
        const datasets = caracteristicas.map((caracteristica) => {
          const frecuencias = periodos.map(
            (mesAnio) => frecuenciaPorMes[mesAnio][caracteristica] || 0
          );
      return {
        label: caracteristica,
        data: frecuencias,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      };
    });

    setHistogramaData({
      labels: periodos,
      datasets,
    });
  }, [categoriaSeleccionada, datos]);

  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  return (
    <div className="histograma-container">
        <h2 className="histograma-title">Histograma de frecuencia de las consultas de los usuarios</h2>
        <div className="histograma-controls">
            <p className="histograma-description">Elija la categoría:</p>
            <select
                className="histograma-select"
                onChange={handleCategoriaChange}
                value={categoriaSeleccionada}
            >
                {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                    {categoria}
                </option>
                ))}
            </select>
        </div>    
        {histogramaData ? (
            <div className="histograma-chart-container">
            <Bar options={options} data={histogramaData} />
            </div>
        ) : (
            <p className="histograma-loading">Cargando datos del histograma...</p>
        )}
    </div>
  );
};

export default Histograma;