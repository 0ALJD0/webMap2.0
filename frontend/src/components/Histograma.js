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
  const [añosDisponibles, setAñosDisponibles] = useState([]);
  const [mesesDisponibles, setMesesDisponibles] = useState([]);
  const [mesesSeleccionados, setMesesSeleccionados] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState(null);
  
// Mapeo de categorías a nombres amigables
  const categoriasLabels = {
    tipo_cocina: 'Tipo de Cocina',
    tipo_establecimiento: 'Tipo de Establecimiento',
    servicios: 'Tipo de Servicio',
    numero_copas: 'Número de Copas',
    numero_tazas:'Número de Tazas',
    numero_cubiertos:'Número de Cubiertos',
    horarios:'Horarios',
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Histograma de la categoría: ${categoriasLabels[categoriaSeleccionada] || categoriaSeleccionada}`, // Usar el mapeo aquí
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
        // Obtener los años disponibles
        const años = [...new Set(Object.values(datos).flat().map(item => new Date(item.periodo).getFullYear()))];
        setAñosDisponibles(años);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!categoriaSeleccionada || !datos[categoriaSeleccionada]) return;

    const datosCategoria = datos[categoriaSeleccionada];

    
    // Filtrar meses disponibles basados en el año seleccionado
    const obtenerMesesDisponibles = (año) => {
      const meses = new Set();
      Object.values(datosCategoria).flat().forEach((item) => {
        const fecha = new Date(item.periodo);
        if (fecha.getFullYear() === año) {
          meses.add(fecha.toLocaleString('es-ES', { month: 'long' }));
        }
      });
      return [...meses];
    };

    if (añoSeleccionado) {
      const meses = obtenerMesesDisponibles(añoSeleccionado);
      setMesesDisponibles(meses);
    }

  }, [categoriaSeleccionada, datos, añoSeleccionado]);


  useEffect(() => {
    if (!añoSeleccionado || !mesesSeleccionados.length) return;

    const datosCategoria = datos[categoriaSeleccionada];
    const frecuenciaPorMes = {};
    
    datosCategoria.forEach((item) => {
      const fecha = new Date(item.periodo);
      const mesAnio = `${fecha.toLocaleString('es-ES', { month: 'long' })} ${fecha.getFullYear()}`;
      if (añoSeleccionado && mesesSeleccionados.includes(fecha.toLocaleString('es-ES', { month: 'long' }))) {
        if (!frecuenciaPorMes[mesAnio]) {
          frecuenciaPorMes[mesAnio] = {};
        }
        if (!frecuenciaPorMes[mesAnio][item.caracteristica]) {
          frecuenciaPorMes[mesAnio][item.caracteristica] = 0;
        }
        frecuenciaPorMes[mesAnio][item.caracteristica] += item.frecuencia;
      }
    });

    const periodos = Object.keys(frecuenciaPorMes).sort((a, b) => new Date(a) - new Date(b));
    const caracteristicas = [...new Set(datosCategoria.map((item) => item.caracteristica))];

    const datasets = caracteristicas.map((caracteristica) => {
      const frecuencias = periodos.map((mesAnio) => frecuenciaPorMes[mesAnio][caracteristica] || 0);
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

    }, [categoriaSeleccionada, datos, añoSeleccionado, mesesSeleccionados]);

    //Obtenemos el cambio de categoria
    const handleCategoriaChange = (e) => {
      setCategoriaSeleccionada(e.target.value);
    };

    //Obtenemos el cambio de Año
    const handleAñoChange = (e) => {
      setAñoSeleccionado(Number(e.target.value));
      setMesesSeleccionados([]);  // Resetea los meses seleccionados
    };

    //Obtenemos el cambio en Meses
    const handleMesesChange = (e) => {
      const selectedMeses = Array.from(e.target.selectedOptions, option => option.value);
      setMesesSeleccionados(selectedMeses);
    };
    // Función para exportar el gráfico como imagen
    const exportarComoImagen = () => {
      const canvas = document.getElementById('histogramaChart'); // Obtén el canvas
      const image = canvas.toDataURL('image/png'); // Convierte a imagen PNG
      const link = document.createElement('a');
      link.href = image;
      link.download = `histograma_${categoriaSeleccionada}.png`; // Nombre del archivo
      link.click(); // Simula un clic para descargar la imagen
    };
    //Función para exportar el grafico como csv
    const exportarComoCSV = () => {
      const csvRows = [];
      const headers = ['Mes', ...histogramaData.datasets.map(d => d.label)];
      csvRows.push(headers.join(','));
    
      histogramaData.labels.forEach((label, index) => {
        const row = [label];
        histogramaData.datasets.forEach((dataset) => {
          row.push(dataset.data[index]);
        });
        csvRows.push(row.join(','));
      });
    
      const csvString = csvRows.join('\n');
      const link = document.createElement('a');
      link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
      link.download = `histograma_${categoriaSeleccionada}.csv`;
      link.click();
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
                    {categoriasLabels[categoria] || categoria} {/* Usar el mapeo o el valor original */}
                </option>
                ))}
            </select>
          <p className="histograma-description">Seleccione el año:</p>
          <select
            className="histograma-select"
            onChange={handleAñoChange}
            value={añoSeleccionado || ''}
          >
            <option value="">Seleccione un año</option>
            {añosDisponibles.map((año) => (
              <option key={año} value={año}>
                {año}
              </option>
            ))}
          </select>

          {añoSeleccionado ? (
            <>
              <p className="histograma-description">Seleccione los meses:</p>
              <select
                multiple
                className="histograma-select"
                onChange={handleMesesChange}
                value={mesesSeleccionados}
              >
                {mesesDisponibles.map((mes) => (
                  <option key={mes} value={mes}>
                    {mes}
                  </option>
                ))}
              </select>
            </>
          ):(<p></p>)}
        </div>    
        {histogramaData ? (
            <div className="histograma-chart-container">
            <Bar id="histogramaChart" // Asignar un ID al canvas para poder acceder a él
            options={options} data={histogramaData} />
            <button onClick={exportarComoImagen} className="export-btn">
              Exportar como imagen
            </button>
            <button onClick={exportarComoCSV} className="export-btn">
              Exportar como CSV
            </button>
            </div>
        ) : (
            <p className="histograma-loading">Cargando datos del histograma...</p>
        )}
    </div>
  );
};

export default Histograma;