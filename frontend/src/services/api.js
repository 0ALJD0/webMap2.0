import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', //URL según tu backend
  withCredentials: true, // Esta opción asegura que las cookies se envíen con las solicitudes
});

// Función para obtener todos los establecimientos
export const fetchEstablecimientos = async () => {
  try {
    const response = await api.get('/establecimientos');
    return response.data;
  } catch (error) {
    console.error('Error fetching establecimientos:', error);
    throw error;
  }
};
// Función para obtener  establecimientos
export const fetchEstablecimiento = async (id) => {
  try {
    const response = await api.get(`/establecimiento/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching establecimientos:', error);
    throw error;
  }
};
// Cargar los tipos de servicio desde el backend
export const fetchTipoServicios = async () => {
  try {
    const response = await api.get('/tipo_servicio');
    const data = response.data; 
    const opciones = data.map(servicio => ({
      id: servicio.id,
      nombre: servicio.nombre,
    }));
    return opciones;
  } catch (error) {
    console.error('Error al cargar tipos de servicio:', error);
  }
}

export const fetchTipoCocina = async () => {
  try {
    const response = await api.get('/tipo_cocina');
    const data = response.data; 
    const opciones = data.map(cocina => ({
      id: cocina.id,
      nombre: cocina.nombre,
    }));
    return opciones;
  } catch (error) {
    console.error('Error al cargar tipos de servicio:', error);
  }
}

// Función para enviar la pregunta al agente virtual
export const preguntarAgenteVirtual = async (pregunta) => {
  try {
    const response = await api.post('/preguntar', { pregunta });
    return response.data.respuesta;
  } catch (error) {
    console.error('Error preguntando al agente virtual:', error);
    throw error;
  }
};
//Funcion para el login
export const login = async (usuario, contrasena) => {
  try {
    //console.log(usuario.usuario, usuario.contrasena,'api');
    
    const response = await api.post('/login', { usuario:usuario.usuario, contrasena:usuario.contrasena });
    if (response.data.token) {
      console.log(response.data.token);
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('authenticated', 'true'); // Esto asegura que puedas usarlo en la ruta protegida
    }
    if (response.data.message === 'Login successful') {
      return response.data;
    } else {
      
      throw new Error('Credenciales incorrectas');
    }
  } catch (error) {
    
    throw error;
  }
};


//Función para el logout
export const logoutAdmin = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

//Funcion para c  rear establecimientos
export const crearEstablecimiento = async (datosEstablecimiento) => {
  try {
    console.log(datosEstablecimiento);
    const response = await api.post('/establecimientos', datosEstablecimiento);
    return response.data;
  } catch (error) {
    console.error('Error al crear establecimiento:', error);
    throw error;
  }
};

//funcion actualizar establecimiento
export const actualizarEstablecimiento = async (id, data) => {
  try {
    const response = await api.put(`/establecimientos/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error actualizando establecimiento:', error);
    throw error;
  }
};
// funcion "elimnar" un establecimiento

export const eliminarEstablecimiento = async (id) => {
  try {
    const response = await api.put(`/eliminar_establecimiento/${id}`, { eliminado: true });
    return response.data;
  } catch (error) {
    console.error('Error deleting establecimiento:', error);
    throw error;
  }
};

export const agregarHorario = async (establecimientoId, data) => {
  try {
    const response = await api.post(`/establecimientos/${establecimientoId}/horarios`, data);
    return response.data;
  } catch (error) {
    console.error('Error al agregar horario:', error);
    throw error;
  }
};

export const actualizarHorario = async (id, data) => {
  try {
    const response = await api.put(`/horarios/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    throw error;
  }
};

export const eliminarHorario = async (id) => {
  try {
    const response = await api.delete(`/horarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    throw error;
  }
};

export const obtenerHorarios = async (establecimientoId) => {
  try {
    const response = await api.get(`/establecimientos/${establecimientoId}/horarios`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    throw error;
  }
};
export const cambiarContrasena = async (data) => {
  try {
    const response = await api.put('admin/password', data);
    return response.data; // Devuelve el mensaje de éxito desde el backend
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    throw error; // Lanza el error para ser manejado en el componente
  }
};

export const obtenerDatos = async () => {
  try {
    const response = await api.get('/histograma');
    const datos = response.data;

    // Procesar las categorías únicas
    const categoriasUnicas = Object.keys(datos);

    // Crear una estructura más organizada para los filtros
    const filtros = categoriasUnicas.reduce((acc, categoria) => {
      acc[categoria] = [...new Set(datos[categoria].map(item => item.caracteristica))]; // Usamos Set para eliminar duplicados
      return acc;
    }, {});
    console.log(filtros);
    return {
      datos,
      categoriasUnicas,
      categoriaSeleccionada: categoriasUnicas.length > 0 ? categoriasUnicas[0] : null,
      filtros,
    };
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error; // Lanza el error para que sea manejado donde se use la función
  }
};
export default api;