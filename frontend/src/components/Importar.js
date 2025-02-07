import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { crearEstablecimiento, agregarHorario } from '../services/api';
import './css/Importar.css';
import { FaInfoCircle } from 'react-icons/fa';

const Importar = ({ onCancel }) => {
    const [csvFile, setCsvFile] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [previewData, setPreviewData] = useState([]);
    useEffect(() => {
        if (mensaje) {
          const timer = setTimeout(() => setMensaje(""), 3000);
          return () => clearTimeout(timer);
        }
      }, [mensaje]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setCsvFile(file);
        if (file) {
            handlePreview(file);
        }
    };

    const handlePreview = (file) => {
        Papa.parse(file, {
            complete: (result) => {
                if (result.data.length > 0) {
                    setPreviewData(result.data.slice(0, 5)); // Mostrar las primeras 5 filas
                } else {
                    setMensaje("El archivo CSV parece estar vacío o mal estructurado.");
                    setPreviewData([]);
                }
            },
            header: true,
            skipEmptyLines: true,
        });
    };
    
    const handleImport = async () => {
        if (!csvFile) {
            setMensaje('Por favor, selecciona un archivo CSV.');
            return;
        }
        
        Papa.parse(csvFile, {
            complete: async (result) => {
                const data = result.data;
                if (data.length < 1) {
                    setMensaje('El archivo CSV parece estar vacío o mal estructurado.');
                    return;
                }
                
                const headers = Object.keys(data[0]); // Extraer claves del primer objeto
                
                const rows = data;
    
                const requiredFields = [
                    'nombre', 'direccion', 'tipo', 'tipo_servicio', 'tipo_cocina', 
                    'latitud', 'longitud', 'descripcion','numero_cubiertos', 'numero_copas','numero_taza','horarios'
                ];

                if (!requiredFields.every(field => headers.includes(field))) {

                    setMensaje('El CSV no contiene todas las columnas necesarias.');
                    return;
                }
                
                for (const row of rows) {
                    
                    const establecimiento = {};
                    // Asignar valores de cada fila al objeto establecimiento
                    headers.forEach((header) => {
                        establecimiento[header] = row[header]; // Acceder a la propiedad correcta
                    });
                    
                    // Convertir campos booleanos
                    establecimiento.petfriendly = establecimiento.petfriendly === 'true';
                    establecimiento.accesibilidad = establecimiento.accesibilidad === 'true';
                    
                    // Convertir listas de IDs a arrays
                    establecimiento.tipo_servicio = establecimiento.tipo_servicio ? establecimiento.tipo_servicio.split(';').map(Number) : [];
                    establecimiento.tipo_cocina = establecimiento.tipo_cocina ? establecimiento.tipo_cocina.split(';').map(Number) : [];
                    
                    try {
                        // 1️⃣ Crear el establecimiento
                        const response = await crearEstablecimiento(establecimiento);
                        console.log(response);
                        const establecimientoId = response.establecimiento.id; // Obtener el ID devuelto por el backend
                        
                        // 2️⃣ Enviar los horarios a la API
                        if (row.horarios) {
                            const horarios = row.horarios.split(';').map((horarioStr) => {
                                const match = horarioStr.match(/(\w+)\s(\d{1,2}:\d{2})\s-\s(\d{1,2}:\d{2})/);
                                if (match) {
                                    return {
                                        dia_semana: match[1], 
                                        hora_apertura: match[2], 
                                        hora_cierre: match[3]
                                    };
                                } else {
                                    console.error(`Formato incorrecto en horarios: ${horarioStr}`);
                                    return null;
                                }
                            }).filter(Boolean);
    
                            for (const horario of horarios) {
                                await agregarHorario(establecimientoId, horario);
                            }
                        }
                    } catch (error) {
                        setMensaje(`Error al importar: ${error.response?.data?.message || error.message}`);
                        return;
                    }
                }
                
                setMensaje('Importación completada exitosamente.');
            },
            header: true,
            skipEmptyLines: true,
        });
    };

    const handleDownloadTemplate = () => {
        const csvContent = `nombre,direccion,tipo,tipo_servicio,tipo_cocina,latitud,longitud,petfriendly,accesibilidad,descripcion,numero_taza,numero_cubiertos,numero_copas,horarios\n` +
            `La Tablita2,Calle1 Av2,Restaurante,1;2,3;4,-0.951560696, -80.691441,true,false,Descripcion Generica,1,1,1,Lunes 9:00 - 19:00; Martes 9:00 - 19:00`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'plantilla_establecimientos.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="importar-popup">
            <div className="importar-content">
                <h2 className="importar-title">Importar Establecimientos desde CSV</h2>
                <div className="importar-instructions-container">
                <h2 className="importar-title">Instrucciones:</h2>
                    <h3 className="importar-subtitle">Tipos de Cocina (tipo_cocina)</h3>
                    <p className="importar-instructions">
                        Usa los siguientes IDs para declarar los tipos de cocina. Puedes agregar varios separados por punto y coma (;):
                    </p>
                    <ul className="importar-list">
                        <li>ID 1: Cocina Italiana</li>
                        <li>ID 2: Cocina Mexicana</li>
                        <li>ID 3: Cocina Asiática</li>
                        <li>ID 4: Cocina Mediterránea</li>
                        {/* Agregar más tipos de cocina según sea necesario */}
                    </ul>

                    <h3 className="importar-subtitle">Tipos de Servicio (tipo_servicio)</h3>
                    <p className="importar-instructions">
                        Usa los siguientes IDs para declarar los tipos de servicio. Puedes agregar varios separados por punto y coma (;):
                    </p>
                    <ul className="importar-list">
                        <li>ID 1: Comida para llevar</li>
                        <li>ID 2: Servicio a mesa</li>
                        <li>ID 3: Buffet</li>
                        <li>ID 4: Catering</li>
                        {/* Agregar más tipos de servicio según sea necesario */}
                    </ul>

                    <h3 className="importar-subtitle">Tipos de Establecimiento (tipo)</h3>
                    <p className="importar-instructions">
                        Usa uno de los siguientes IDs para declarar el tipo de establecimiento:
                    </p>
                    <ul className="importar-list">
                        <li>ID 1: Restaurante</li>
                        <li>ID 2: Cafetería</li>
                        <li>ID 3: Bar</li>
                        <li>ID 4: Restaurante Rápido</li>
                        {/* Agregar más tipos de establecimiento según sea necesario */}
                    </ul>

                    <h3 className="importar-subtitle">Instrucciones para el archivo CSV</h3>
                    <p className="importar-instructions">
                        Subir un archivo CSV con la siguiente estructura:
                    </p>
                    <pre className="importar-example">
                        nombre,direccion,tipo,tipo_servicio,tipo_cocina,latitud,longitud,petfriendly,accesibilidad,
                        descripcion,numero_taza,numero_cubiertos,numero_copas,horarios
                        <br />
                        La Tablita2,Calle1 Av2,Restaurante,1;2,3;4,-0.951560696, -80.691441,true,false,Descripcion Generica,1,1,1,Lunes 9:00 - 19:00; Martes 9:00 - 19:00
                        <br />
                        Si un campo como descripcion o direccion contendrás comas escribirlo en tre comillas:
                        <br />
                        "Descrpcion, Generica °1"
                    </pre>
                </div>
                <input type="file" className="importar-file-input" accept=".csv" onChange={handleFileChange} />
                {mensaje && (
                    <p className={`importar-message ${mensaje ? "fade-out" : ""}`}>
                        <FaInfoCircle style={{ marginRight: '8px' }} /> {/* Ícono de información */}
                        {mensaje}
                    </p>
                )}
                {previewData.length > 0 && (
                    <div className="importar-preview">
                        <h3 className="importar-subtitle">Vista Previa del CSV</h3>
                        <table className="importar-table">
                            <thead>
                                <tr>
                                    {Object.keys(previewData[0]).map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {Object.values(row).map((value, colIndex) => (
                                            <td key={colIndex}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="importar-button-group">
                    <button className="importar-button" onClick={onCancel}>Cancelar</button>
                    <button className="importar-button" onClick={handleDownloadTemplate}>Plantilla CSV</button>
                    <button className="importar-button" onClick={handleImport} disabled={!csvFile}>Importar CSV</button>
                </div>
            </div>
        </div>
    );
};

export default Importar;