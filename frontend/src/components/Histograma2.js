  import React, { useEffect, useState } from "react";
  import { Bar } from "react-chartjs-2";
  import Select from "react-select";
  import './css/Histograma.css';
  import { obtenerEstadisticas } from "../services/api";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  import zoomPlugin from "chartjs-plugin-zoom"; 

  // Registrar componentes de Chart.js
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin 
  );

  const Histograma2 = () => {
    const [estadisticas, setEstadisticas] = useState([]);
    const [filtroTipo, setFiltroTipo] = useState(null);
    const [tiposEstablecimiento, setTiposEstablecimiento] = useState([]);
    const [filtroEstrella, setFiltroEstrella] = useState(null);
    const opcionesEstrellas = [
      { value: 1, label: '⭐ ' },
      { value: 2, label: '⭐⭐ ' },
      { value: 3, label: '⭐⭐⭐ ' },
      { value: 4, label: '⭐⭐⭐⭐ ' },
      { value: 5, label: '⭐⭐⭐⭐⭐' }
    ];
    const [histogramaData, setHistogramaData] = useState(null);
    // Cargar estadísticas al cargar la página
    useEffect(() => {
      // Obtener estadísticas desde el backend
      const fetchEstadisticas = async () => {
          try {
          const response = await obtenerEstadisticas();
          setEstadisticas(response);
          extraerFiltros(response); // Extraer opciones para los selectores
          } catch (error) {
          console.error("Error al obtener las estadísticas:", error);
          }
      };
      fetchEstadisticas();
    }, []);

    useEffect(() => {
      setHistogramaData(prepararDatosGrafico());
    }, [estadisticas, filtroTipo, filtroEstrella]);
    // Extraer opciones para los selectores
    const extraerFiltros = (data) => {
      const tipos = new Set(data.map((item) => item.caracteristica));
      setTiposEstablecimiento([...tipos].map((tipo) => ({ value: tipo, label: tipo })));
    };

    // Filtrar estadísticas según los filtros seleccionados
    const filtrarEstadisticas = () => {
      return estadisticas.filter((item) => {
        const cumpleTipo = !filtroTipo || item.caracteristica === filtroTipo.value;
        const cumpleEstrellas = !filtroEstrella || 
        (item.promedio_puntuaciones > (filtroEstrella.value - 1) && item.promedio_puntuaciones <= filtroEstrella.value);  
        return cumpleTipo && cumpleEstrellas;
      });
    };

    // Preparar datos para el gráfico
    const prepararDatosGrafico = () => {
      const datosFiltrados = filtrarEstadisticas();
      const labels = [...new Set(datosFiltrados.map((item) => item.mes_anio))].sort();
      const datasets = [];

      // Agrupar por tipo de establecimiento
      const tipos = [...new Set(datosFiltrados.map((item) => item.caracteristica))];
      tipos.forEach((tipo) => {
        const data = labels.map((mes) => {
          const item = datosFiltrados.find(
            (d) => d.mes_anio === mes && d.caracteristica === tipo
          );
          return item ? item.cantidad_establecimientos : 0;
        });
        const dataPromedio = labels.map((mes) => {
          const item = datosFiltrados.find(
            (d) => d.mes_anio === mes && d.caracteristica === tipo
          );
          // Si no hay filtro de estrellas o cumple con el filtro, mostrar el valor
          return item && (!filtroEstrella || item.promedio_puntuaciones <= filtroEstrella.value) 
            ? item.promedio_puntuaciones 
            : 0;
        });
        datasets.push({
          label: tipo,
          data: data,
          stack: 'Stack 0', // Hace que las barras sean apiladas
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
          barThickness: 40,
          barPercentage: 0.9,
          categoryPercentage: 0.6,
        });
        datasets.push({
          label: `${tipo} - Promedio`,
          data: dataPromedio,
          stack: 'Stack 1', // Hace que las barras sean apiladas
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
          barThickness: 40,
          barPercentage: 0.9,
          categoryPercentage: 0.6,
        });
      });

      return {
        labels: labels,
        datasets: datasets,
        
      };
    };

      // Opciones del gráfico
      const opciones = {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Cantidad de establecimientos y promedio de valoraciones por mes y tipo",
            },
            zoom: {
              pan: {
                enabled: true,
                mode: "x", // Habilitar desplazamiento horizontal
              },
              zoom: {
                wheel: {
                  enabled: true, // Habilitar zoom con la rueda del mouse
                },
                pinch: {
                  enabled: true, // Habilitar zoom con gestos en dispositivos táctiles
                },
                mode: "x", // Habilitar zoom horizontal
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Cantidad / Promedio",
              },
            },
            x: {
              title: {
                display: true,
                text: "Mes-Año",
              },
            },
          },
        };

        const exportarImagen = () => {
          const chart = document.getElementById('histograma2-chart');
          if (chart) {
            const link = document.createElement('a');
            link.href = chart.toDataURL('image/png');
            link.download = 'histograma2.png';
            link.click();
          } else {
            console.error("No se encontró el gráfico para exportar.");
          }
        };
        const exportarCSV = () => {
          if (!histogramaData) return;

          let csvContent = 'data:text/csv;charset=utf-8,';
          csvContent += 'Periodo,Característica,Frecuencia\n';

          histogramaData.labels.forEach((periodo, i) => {
            histogramaData.datasets.forEach((dataset) => {
              csvContent += `${periodo},${dataset.label},${dataset.data[i]}\n`;
            });
          });

          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.href = encodedUri;
          link.download = 'histograma2.csv';
          link.click();
        };

        return (
          <div>
            <h1>Histrograma de valoración de establecimientos</h1>
            <div className="histograma-chart-container">
              {/* Contenedor de los filtros */}
              <div className="histograma-controls">
              <div>
                <label htmlFor="tipo-establecimiento" className="histograma-label">Filtrar por tipo</label>
                <Select
                  className="histograma-select2"
                  options={tiposEstablecimiento}
                  placeholder="Filtrar por tipo"
                  onChange={setFiltroTipo}
                  isClearable
                  id="tipo-establecimiento"
                />
              </div>
              <div>
                <label htmlFor="filtro-estrellas" className="histograma-label">Filtrar por valoración</label>
                <Select
                  className="histograma-select2"
                  options={opcionesEstrellas}
                  placeholder="Filtrar por valoración"
                  onChange={setFiltroEstrella}
                  isClearable
                  id="filtro-estrellas"
                />
              </div>
              </div>
        
              {/* Contenedor del gráfico */}
              <div className="histograma-grafico2">
                <Bar id="histograma2-chart" data={prepararDatosGrafico()} options={opciones}
                style={{padding: '30px'}} />
                <div className='histograma-botones'>
                  <button onClick={exportarImagen} className="export-boton">
                    Exportar como imagen
                  </button>
                  <button onClick={exportarCSV} className="export-boton">
                    Exportar como CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
  };

  export default Histograma2;