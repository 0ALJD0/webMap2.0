// src/pages/AdminPage.js
import React, { useEffect, useState } from 'react';
import { fetchEstablecimientos, logoutAdmin } from '../services/api';
import { useNavigate } from 'react-router-dom';
import CrearEditarEstablecimiento from '../components/CrearEditarEstablecimiento';
import EstablecimientosLista from '../components/EstablecimientosLista';
import CambiarContra from '../components/CambiarContra';
import MapaUno from '../components/MapUno';
import Histograma from '../components/Histograma';
import './css/AdminPage.css';

const AdminPage = () => {
  const [establecimientos, setEstablecimientos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarCambio, setMostrarCambio] = useState(false); // inicializar variable que va a tener el mostrar cambiarContra
  const [establecimientoSeleccionado, setEstablecimientoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  /*useEffect(() => {
    fetchEstablecimientos()
      .then(data => setEstablecimientos(data))
      .catch(error => console.error('Error fetching establecimientos:', error));
  }, []);*/
  const fetchAndSetEstablecimientos = async () => {
    try {
      const data = await fetchEstablecimientos();
      setEstablecimientos(data);
    } catch (error) {
      console.error('Error fetching establecimientos:', error);
    }
  };

  useEffect(() => {
    fetchAndSetEstablecimientos();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      sessionStorage.removeItem('authenticated');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleMostrarCambio=async () => {
    setMostrarCambio(true);
  };
  const handleOcultarCambio=async () => {
    setMostrarCambio(false);
  };
  const mostrarFormularioCrear = () => {
    setEstablecimientoSeleccionado(null); // Reiniciar el estado seleccionado al abrir el formulario
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
  };
  const handleEditEstablecimiento = (establecimiento) => {
    setEstablecimientoSeleccionado(establecimiento);
    setMostrarFormulario(true);
  };

  const mostrarMensajeTemporal = (msg) => {
    setMensaje(msg);
    setTimeout(() => {
      setMensaje('');
    }, 3000); // El mensaje desaparece después de 3 segundos
  };
  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Gestión de Establecimientos</h1>
        <div className="admin-header-buttons">
          <button onClick={handleLogout}>Cerrar Sesión</button>
          <button onClick={handleMostrarCambio}>Cambiar Contraseña</button>
        </div>
      </header>

      <div className="admin-content">
        
        {mostrarFormulario && (
          <>
            <div className="backdrop" onClick={cerrarFormulario}></div>
            <div className="popup">
              <div className="popup-content">
                <CrearEditarEstablecimiento
                  onCancel={cerrarFormulario}
                  establecimiento={establecimientoSeleccionado}
                  onSuccess={fetchAndSetEstablecimientos}
                />
                {mensaje && <p className="ad-p">{mensaje}</p>}
              </div>
            </div>
          </>
        )}
      </div>

      {mostrarCambio && (
        <>
          <div className="backdrop" onClick={handleOcultarCambio}></div>
          <div className="popup">
            <div className="popup-content">
              <CambiarContra onCancel={handleOcultarCambio} />
            </div>
          </div>
        </>
      )}

      <div className="admin-main-content">
        <div className="admin-establecimientos-lista-container">
        <button className="btn-nuevo" onClick={mostrarFormularioCrear}>
          Nuevo Establecimiento
        </button>
          <EstablecimientosLista
            establecimientos={establecimientos}
            onEdit={handleEditEstablecimiento}
            onEliminar={fetchAndSetEstablecimientos}
            mostrarMensaje={mostrarMensajeTemporal}
          />
        </div>
        <div className="admin-mapa-container">
          <MapaUno establecimientos={establecimientos} />
        </div>
      </div>
      <div className="admin-histograma-container">
          <Histograma />
        </div>
    </div>
  );
};

export default AdminPage;
