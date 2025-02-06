import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Select from "react-select";
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
  // Extraer opciones para los selectores
  const extraerFiltros = (data) => {
    const tipos = new Set(data.map((item) => item.caracteristica));
    setTiposEstablecimiento([...tipos].map((tipo) => ({ value: tipo, label: tipo })));
  };

  // Filtrar estadísticas según los filtros seleccionados
  const filtrarEstadisticas = () => {
    return estadisticas.filter((item) => {
      return !filtroTipo || item.caracteristica === filtroTipo.value;
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
        return item ? item.promedio_puntuaciones : 0;
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



  return (
    <div>
      <h1>N Establecimientos Valorados x Mes y Año/ Promedio de Valoración de los estblecimientos</h1>
      <div style={{ marginBottom: "20px" }}>
        <Select
          options={tiposEstablecimiento}
          placeholder="Todos los establecimientoss"
          onChange={setFiltroTipo}
          isClearable
        />
      </div>
      <Bar data={prepararDatosGrafico()} options={opciones} />
    </div>
  );
};

export default Histograma2;