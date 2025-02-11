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
                        <li>ID 1: Argentina</li>
                        <li>ID 2: Asiática</li>
                        <li>ID 3: Brasilera</li>
                        <li>ID 4: China</li>
                        <li>ID 5: Colombiana</li>
                        <li>ID 6: Coreana</li>
                        <li>ID 7: Costa Rica</li>
                        <li>ID 8: Escandinava</li>
                        <li>ID 9: Ecuatoriana</li>
                        <li>ID 10: Venezolana</li>
                        <li>ID 11: Italiana</li>
                        <li>ID 12: Japonesa</li>
                        <li>ID 13: Kosher</li>
                        <li>ID 14: Mexicana</li>
                        <li>ID 15: Rusa</li>
                        <li>ID 16: Cocina Andina</li>
                        <li>ID 17: Cocina Patrimonial</li>
                        <li>ID 18: Comida rápida</li>
                        <li>ID 19: Frutas y Vegetales</li>
                        <li>ID 20: Mariscos</li>
                        <li>ID 21: Mediterránea</li>
                        <li>ID 22: Novoandina</li>
                        <li>ID 23: Panadería, pastelería y repostería</li>
                        <li>ID 24: Parrilladas</li>
                        <li>ID 25: Pizza</li>
                        <li>ID 26: Vegetariana</li>
                        {/* Agregar más tipos de cocina según sea necesario */}
                    </ul>

                    <h3 className="importar-subtitle">Tipos de Servicio (tipo_servicio)</h3>
                    <p className="importar-instructions">
                        Usa los siguientes IDs para declarar los tipos de servicio. Puedes agregar varios separados por punto y coma (;):
                    </p>
                    <ul className="importar-list">
                        <li>ID 1: Menú</li>
                        <li>ID 2: Autoservicio</li>
                        <li>ID 3: Buffet</li>
                        <li>ID 4: Menú fijo</li>
                        <li>ID 5: Servicio a domicilio</li>
                        <li>ID 6: Servicio al auto</li>
                        {/* Agregar más tipos de servicio según sea necesario */}
                    </ul>

                    <h3 className="importar-subtitle">Tipos de Establecimiento (tipo)</h3>
                    <p className="importar-instructions">
                        Usa uno de los siguientes Name's para declarar el tipo de establecimiento:
                    </p>
                    <ul className="importar-list">
                        <li>Restaurante</li>
                        <li>Cafetería</li>
                        <li>Bar</li>
                        <li>Establecimiento móvil</li>
                        <li>Discoteca</li>
                        <li>Plaza de Comida</li>
                        <li>Servicio de Catering</li>
                        {/* Agregar más tipos de establecimiento según sea necesario */}
                    </ul>

                    <h3 className="importar-subtitle">Horarios (horarios)</h3>
                    <p className="importar-instructions">
                       Puedes agregar los horarios siguiendo el siguiente esquema:
                    </p>
                    <p className="importar-instructions">
                       Un día de la semana (Lunes a Domingo):
                        <br />
                        Lunes: 9:00 - 19:00
                        <br />
                        Para varios días, debes concatennerlos con (;):
                        <br />
                        Lunes 9:00 - 19:00; Martes 9:00 - 19:00; Miércoles 9:00 - 19:00; Jueves 9:00 - 19:00; Viernes 9:00 - 19:00; Sabado 9:00 - 19:00; Domingo 9:00 - 19:00
                    </p>

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