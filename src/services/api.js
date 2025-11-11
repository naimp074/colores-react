// Detectar si estamos en desarrollo o producción
const isDevelopment = import.meta.env.DEV;

// URL del backend: usa variable de entorno VITE_API_URL (debe terminar en /api)
const base = import.meta.env.VITE_API_URL || 
  (isDevelopment 
    ? "http://localhost:3001/api" 
    : "https://colores-back-five.vercel.app/api");

// Log para debug
console.log(isDevelopment ? "🔧 Modo desarrollo" : "🚀 Modo producción", "- API URL:", base);

// Función helper para hacer peticiones
const fetchAPI = async (endpoint, options = {}) => {
  try {
    // Asegurar que base termine en /api y endpoint empiece con /
    const baseUrl = base.endsWith('/api') ? base : base.endsWith('/') ? base.slice(0, -1) : `${base}/api`;
    const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${endpointPath}`;
    
    console.log("📡 Fetching:", url); // Debug
    
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



