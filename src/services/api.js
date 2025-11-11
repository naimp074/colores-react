// Detectar si estamos en desarrollo o producción
const isDevelopment = import.meta.env.DEV;
// URL del backend: usa variable de entorno, o detecta automáticamente
const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (isDevelopment 
    ? "http://localhost:3001/api" 
    : "https://colores-back-five.vercel.app/api");

// Log para debug (solo en desarrollo)
if (isDevelopment) {
  console.log("🔧 Modo desarrollo - API URL:", API_BASE_URL);
} else {
  console.log("🚀 Modo producción - API URL:", API_BASE_URL);
}

// Función helper para hacer peticiones
const fetchAPI = async (endpoint, options = {}) => {
  try {
    // Asegurar que no haya doble slash en la URL
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${endpointPath}`;
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || "Error en la petición");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Obtener todos los colores
export const obtenerColores = async () => {
  const response = await fetchAPI("/colores");
  return response.data || [];
};

// Obtener un color por ID
export const obtenerColorPorId = async (id) => {
  const response = await fetchAPI(`/colores/${id}`);
  return response.data;
};

// Agregar un color
export const agregarColor = async (color) => {
  const response = await fetchAPI("/colores", {
    method: "POST",
    body: JSON.stringify({
      nombre: color.nombre,
      hex: color.hex,
      rgb: color.rgb,
    }),
  });
  return response.data;
};

// Editar un color
export const editarColor = async (id, color) => {
  const response = await fetchAPI(`/colores/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      nombre: color.nombre,
      hex: color.hex,
      rgb: color.rgb,
    }),
  });
  return response.data;
};

// Eliminar un color
export const eliminarColor = async (id) => {
  const response = await fetchAPI(`/colores/${id}`, {
    method: "DELETE",
  });
  return response.data;
};



