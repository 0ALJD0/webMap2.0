import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { obtenerDatos } from '../services/api';
import './css/Histograma.css';
import Spinner from './Spinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Histograma = () => {
  const [datos, setDatos] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [caracteristicaSeleccionada, setCaracteristicaSeleccionada] = useState('');
  const [años, setAños] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState('');
  const [meses, setMeses] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [histogramaData, setHistogramaData] = useState(null);

  const categoriasLabels = {
    tipo_cocina: 'Tipo de Cocina',
    tipo_establecimiento: 'Tipo de Establecimiento',
    servicios: 'Tipo de Servicio',
    numero_copas: 'Número de Copas',
    numero_tazas: 'Número de Tazas',
    numero_cubiertos: 'Número de Cubiertos',
    horarios: 'Horarios',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { datos, categoriasUnicas } = await obtenerDatos();
        setDatos(datos);
        setCategorias(categoriasUnicas);

      // Generar el histograma por defecto al cargar los datos
      generarHistogramaPorDefecto(datos, categoriasUnicas);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    fetchData();
  }, []);
  const generarHistogramaPorDefecto = (datos, categorias) => {
    // Estructura para almacenar la frecuencia por mes, categoría y característica
    const frecuenciaPorMes = {};
  
    // Iterar sobre todas las categorías
    categorias.forEach((categoria) => {
      const datosCategoria = datos[categoria];
  
      if (!datosCategoria) return;
  
      // Filtrar por año y mes si están seleccionados
      let datosFiltrados = datosCategoria;
      if (añoSeleccionado) {
        datosFiltrados = datosFiltrados.filter(
          (item) => new Date(item.periodo).getFullYear() === parseInt(añoSeleccionado)
        );
      }
      if (mesSeleccionado) {
        datosFiltrados = datosFiltrados.filter(
          (item) =>
            new Date(item.periodo).toLocaleString('es-ES', { month: 'long' }) === mesSeleccionado
        );
      }
  
      // Procesar los datos filtrados
      datosFiltrados.forEach((item) => {
        const fecha = new Date(item.periodo);
        const mesAnio = `${fecha.toLocaleString('es-ES', { month: 'long' })} ${fecha.getFullYear()}`;
  
        if (!frecuenciaPorMes[mesAnio]) {
          frecuenciaPorMes[mesAnio] = {};
        }
  
        if (!frecuenciaPorMes[mesAnio][categoria]) {
          frecuenciaPorMes[mesAnio][categoria] = {};
        }
  
        if (!frecuenciaPorMes[mesAnio][categoria][item.caracteristica]) {
          frecuenciaPorMes[mesAnio][categoria][item.caracteristica] = 0;
        }
  
        frecuenciaPorMes[mesAnio][categoria][item.caracteristica] += item.frecuencia;
      });
    });
  
    // Obtener los periodos ordenados
    const periodos = Object.keys(frecuenciaPorMes).sort((a, b) => {
      const [mesA, anioA] = a.split(' ');
      const [mesB, anioB] = b.split(' ');
  
      const mesesOrdenados = [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre',
      ];
  
      return anioA - anioB || mesesOrdenados.indexOf(mesA) - mesesOrdenados.indexOf(mesB);
    });
  
    // Crear datasets para cada categoría
    const datasets = categorias.map((categoria, index) => {
      const caracteristicas = [...new Set(datos[categoria].map((item) => item.caracteristica))];
    
      return {
        label: categoria,
        data: periodos.map((mesAnio) => {
          const frecuenciasCaracteristicas = frecuenciaPorMes[mesAnio][categoria] || {};
          return Object.values(frecuenciasCaracteristicas).reduce((sum, freq) => sum + freq, 0);
        }),
        backgroundColor: caracteristicas.map((_, i) =>
          `rgba(${Math.floor(100 + i * 50)}, ${Math.floor(150 + i * 30)}, ${Math.floor(200 - i * 40)}, 0.5)`
        ),
      };
    });
  
    // Actualizar el estado del histograma
    setHistogramaData({
      labels: periodos,
      datasets,
    });
  };
  useEffect(() => {
    if (!categoriaSeleccionada || !datos[categoriaSeleccionada]) return;

    const datosCategoria = datos[categoriaSeleccionada];
    const caracteristicasUnicas = [...new Set(datosCategoria.map(item => item.caracteristica))];
    setCaracteristicas(caracteristicasUnicas);
    setCaracteristicaSeleccionada('');
    
    const añosUnicos = [...new Set(datosCategoria.map(item => new Date(item.periodo).getFullYear()))];
    setAños(añosUnicos.sort());
    const mesesUnicos = [...new Set(datosCategoria.map(item => new Date(item.periodo).toLocaleString('es-ES', { month: 'long' })))];
    setMeses(mesesUnicos.sort((a, b) => {
      const mesesOrdenados = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio", 
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ];
      return mesesOrdenados.indexOf(a) - mesesOrdenados.indexOf(b);
    }));
    setAñoSeleccionado('');
  }, [categoriaSeleccionada, datos]);

  useEffect(() => {
    if (!categoriaSeleccionada || !datos[categoriaSeleccionada]) return;

    let datosFiltrados = datos[categoriaSeleccionada];

    // Filtrar por año, mes y característica si están seleccionados
    if (añoSeleccionado) {
      datosFiltrados = datosFiltrados.filter(item => new Date(item.periodo).getFullYear() === parseInt(añoSeleccionado));
    }
    if (mesSeleccionado) {
      datosFiltrados = datosFiltrados.filter(item => new Date(item.periodo).toLocaleString('es-ES', { month: 'long' }) === mesSeleccionado);
    }

    // Estructura para almacenar frecuencia por periodo y característica
    const frecuenciaPorMes = {};

    datosFiltrados.forEach(item => {
      const fecha = new Date(item.periodo);
      const mesAnio = `${fecha.toLocaleString('es-ES', { month: 'long' })} ${fecha.getFullYear()}`;

      if (!frecuenciaPorMes[mesAnio]) {
        frecuenciaPorMes[mesAnio] = {};
      }

      if (!frecuenciaPorMes[mesAnio][item.caracteristica]) {
        frecuenciaPorMes[mesAnio][item.caracteristica] = 0;
      }

      frecuenciaPorMes[mesAnio][item.caracteristica] += item.frecuencia;
    });

    // Obtener los periodos ordenados
    const periodos = Object.keys(frecuenciaPorMes).sort((a, b) => {
      const [mesA, anioA] = a.split(" ");
      const [mesB, anioB] = b.split(" ");
      
      const mesesOrdenados = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio", 
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ];

      return anioA - anioB || mesesOrdenados.indexOf(mesA) - mesesOrdenados.indexOf(mesB);
    });

    // Obtener todas las características únicas si no se ha seleccionado una
    const caracteristicas = caracteristicaSeleccionada
      ? [caracteristicaSeleccionada]
      : [...new Set(datosFiltrados.map(item => item.caracteristica))];

    // Crear datasets por cada característica (para barras separadas o apiladas)
    const datasets = caracteristicas.map((caracteristica, index) => {
      const frecuencias = periodos.map(mesAnio => frecuenciaPorMes[mesAnio][caracteristica] || 0);

      return {
        label: caracteristica,
        data: frecuencias,
        backgroundColor: `rgba(${Math.floor(100 + index * 50)}, ${Math.floor(150 + index * 30)}, ${Math.floor(200 - index * 40)}, 0.5)`,
        stack: 'Stack 0', // Hace que las barras sean apiladas
      };
    });

    setHistogramaData({
      labels: periodos,
      datasets,
    });

  }, [categoriaSeleccionada, caracteristicaSeleccionada, añoSeleccionado, mesSeleccionado, datos]);

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
      <h2 className='histograma-titulo'>Histograma de tendencias de las consultas</h2>
      <div className="histograma-chart-container">
        <div className="histograma-controls">
          <select className='histograma-select' onChange={e => setCategoriaSeleccionada(e.target.value)} value={categoriaSeleccionada}>
            <option value="">Seleccione una categoría</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>{categoriasLabels[categoria] || categoria}</option>
            ))}
          </select>
          <select className='histograma-select' onChange={e => setCaracteristicaSeleccionada(e.target.value)} value={caracteristicaSeleccionada} disabled={!caracteristicas.length}>
            <option value="">Todas las características</option>
            {caracteristicas.map(caracteristica => (
              <option key={caracteristica} value={caracteristica}>{caracteristica}</option>
            ))}
          </select>
          <select className='histograma-select' onChange={e => setAñoSeleccionado(e.target.value)} value={añoSeleccionado} disabled={!años.length}>
            <option value="">Todos los años</option>
            {años.map(año => (
              <option key={año} value={año}>{año}</option>
            ))}
          </select>
          <select className='histograma-select' onChange={e => setMesSeleccionado(e.target.value)} value={mesSeleccionado} disabled={!meses.length}>
            <option value="">Todos los meses</option>
            {meses.map(mes => (
              <option key={mes} value={mes}>{mes}</option>
            ))}
          </select>
        </div>
        {datos && Object.keys(datos).length > 0 ? (
        histogramaData && histogramaData.labels.length > 0 ? (
            <div className='histrograma-grafico'>
              <Bar data={histogramaData}
              style={{padding: '30px'}}
               />
              <div className='histograma-botones'>
                <button onClick={exportarComoImagen} className="export-boton">
                  Exportar como imagen
                </button>
                <button onClick={exportarComoCSV} className="export-boton">
                  Exportar como CSV
                </button>
              </div>
            </div>
          ) : (
            <p className='parrafo-histograma'>Seleccione una categoría para ver el histograma.</p>
          )
        ) : (
          <Spinner/>
        )}
        </div>
    </div>
  );
};

export default Histograma;
