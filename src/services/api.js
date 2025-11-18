// Detectar si estamos en desarrollo o producción
const isDevelopment = import.meta.env.DEV;

// URL del backend: usa variable de entorno VITE_API_URL (debe terminar en /api)
const base = import.meta.env.VITE_API_URL || 
  (isDevelopment 
    ? "http://localhost:3001/api" 
    : "https://colores-back-five.vercel.app/api");

// Logs detallados para diagnóstico
console.log("═══════════════════════════════════════");
console.log("🔍 DIAGNÓSTICO DE CONFIGURACIÓN");
console.log("═══════════════════════════════════════");
console.log("📍 Modo:", isDevelopment ? "🔧 DESARROLLO" : "🚀 PRODUCCIÓN");
console.log("🌐 Variable VITE_API_URL:", import.meta.env.VITE_API_URL || "❌ NO CONFIGURADA");
console.log("🔗 URL Base de API:", base);
if (!import.meta.env.VITE_API_URL && !isDevelopment) {
  console.warn("⚠️ ADVERTENCIA: VITE_API_URL no está configurada en Netlify!");
  console.warn("⚠️ Usando URL por defecto:", base);
  console.warn("⚠️ Ve a Netlify → Site settings → Environment variables");
  console.warn("⚠️ Agrega: VITE_API_URL = https://colores-back-five.vercel.app/api");
}

if (isDevelopment) {
  console.log("💡 Para desarrollo local:");
  console.log("   1. Asegúrate de que el backend esté corriendo en http://localhost:3001");
  console.log("   2. Verifica que el .env tenga: VITE_API_URL=http://localhost:3001/api");
  console.log("   3. Si cambiaste el .env, reinicia el servidor de desarrollo (npm run dev)");
}
console.log("═══════════════════════════════════════");

// Función helper para hacer peticiones
const fetchAPI = async (endpoint, options = {}) => {
  // Construir URL correctamente
  let baseUrl = base.trim();
  // Asegurar que base termine en /api (sin barra final)
  if (baseUrl.endsWith('/api/')) {
    baseUrl = baseUrl.slice(0, -1); // Quitar barra final
  } else if (!baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.endsWith('/') ? `${baseUrl.slice(0, -1)}/api` : `${baseUrl}/api`;
  }
  
  // Asegurar que endpoint empiece con /
  const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${endpointPath}`;
  
  try {
    console.log("─────────────────────────────────────");
    console.log("📡 SOLICITUD API");
    console.log("─────────────────────────────────────");
    console.log("🔗 URL Base original:", base);
    console.log("🔗 URL Base procesada:", baseUrl);
    console.log("🔗 URL completa:", url);
    console.log("📝 Método:", options.method || "GET");
    console.log("📦 Endpoint:", endpoint);
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    console.log("📊 Respuesta recibida:");
    console.log("   Status:", response.status, response.statusText);
    console.log("   OK:", response.ok);
    console.log("   Headers CORS:", {
      "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
      "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
    });

    const data = await response.json();
    console.log("✅ Datos recibidos:", data);

    if (!response.ok) {
      console.error("❌ Error en la respuesta:");
      console.error("   Status:", response.status);
      console.error("   Mensaje:", data.mensaje || "Error desconocido");
      console.error("   Datos completos:", data);
      throw new Error(data.mensaje || `Error ${response.status}: ${response.statusText}`);
    }

    console.log("✅ Solicitud exitosa");
    console.log("─────────────────────────────────────");
    return data;
  } catch (error) {
    console.error("─────────────────────────────────────");
    console.error("❌ ERROR EN LA SOLICITUD");
    console.error("─────────────────────────────────────");
    console.error("🔗 URL intentada:", url);
    console.error("📝 Tipo de error:", error.name);
    console.error("💬 Mensaje:", error.message);
    
    if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
      console.error("🔍 DIAGNÓSTICO:");
      
      // Detectar si es un error de conexión (backend no está corriendo)
      if (url.includes("localhost") || url.includes("127.0.0.1")) {
        console.error("❌ ERROR: El backend NO está corriendo en localhost");
        console.error("📋 PASOS PARA SOLUCIONAR:");
        console.error("   1. Abre una nueva terminal");
        console.error("   2. Ve a la carpeta del backend:");
        console.error("      cd c:\\Users\\Usuario\\Desktop\\trabajos\\administrarcolores_back");
        console.error("   3. Inicia el backend:");
        console.error("      npm run dev");
        console.error("   4. Espera a ver: 'El servidor se esta ejecutando en http://localhost:3001'");
        console.error("   5. Vuelve a esta página y recarga");
        console.error("");
        console.error("🔗 URL que intentó conectar:", url);
        console.error("💡 El backend debe estar corriendo en:", url.split('/api')[0]);
      } else {
        console.error("   1. ¿El backend está funcionando?");
        console.error("   2. ¿La URL es correcta?", url);
        console.error("   3. ¿Hay problemas de CORS?");
        console.error("   4. ¿El backend responde a OPTIONS?");
        console.error("💡 SOLUCIÓN:");
        console.error("   - Verifica que el backend esté desplegado en Vercel");
        console.error("   - Verifica la variable VITE_API_URL en Netlify");
        console.error("   - Prueba la URL directamente:", url);
      }
    }
    
    if (error.name === "SyntaxError") {
      console.error("🔍 DIAGNÓSTICO:");
      console.error("   El servidor no devolvió JSON válido");
      console.error("   Posible error 404 o 500 en el backend");
    }
    
    console.error("─────────────────────────────────────");
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



