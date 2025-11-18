# 🔧 Solución para Desarrollo Local

## ❌ Error: ERR_CONNECTION_REFUSED

Este error significa que el backend **NO está corriendo** o **no puede iniciar**.

## ✅ Checklist de Verificación

### 1. Verificar que el Backend tenga el archivo .env

**Ubicación**: `c:\Users\Usuario\Desktop\trabajos\administrarcolores_back\.env`

**Debe contener**:
```env
PORT=3001
MONGODB=mongodb://localhost:27017/paletacolores
```

O si usas MongoDB Atlas:
```env
PORT=3001
MONGODB=mongodb+srv://usuario:password@cluster.mongodb.net/paletacolores
```

### 2. Verificar que MongoDB esté corriendo

**Si usas MongoDB local:**
- Abre MongoDB Compass o inicia el servicio de MongoDB
- Verifica que esté corriendo en el puerto 27017

**Si usas MongoDB Atlas:**
- Verifica que la URL de conexión sea correcta
- Verifica que la IP esté en la whitelist (0.0.0.0/0 para permitir todas)

### 3. Iniciar el Backend

**En una terminal nueva:**
```bash
cd c:\Users\Usuario\Desktop\trabajos\administrarcolores_back
npm install  # Solo si no has instalado las dependencias
npm run dev
```

**Deberías ver:**
```
✅ Conexión con BD exitosa
El servidor se esta ejecutando en http://localhost:3001
```

**Si ves un error:**
- ❌ "Falta MONGODB_URI o MONGODB": El archivo .env no existe o no tiene la variable MONGODB
- ❌ "Error al conectar con MongoDB": La URL de MongoDB es incorrecta o MongoDB no está corriendo
- ❌ "Port 3001 is already in use": El puerto está ocupado, cierra otros procesos o cambia el puerto

### 4. Verificar que el Backend responda

**Abre en el navegador:**
```
http://localhost:3001/api/colores
```

**Deberías ver:**
```json
{
  "success": true,
  "data": [],
  "total": 0
}
```

### 5. Verificar el Frontend

**En otra terminal (deja el backend corriendo):**
```bash
cd c:\Users\Usuario\Desktop\trabajos\administrarcolores
npm run dev
```

**Abre:** `http://localhost:5173`

**En la consola deberías ver:**
- ✅ `🔧 DESARROLLO`
- ✅ `URL Base de API: http://localhost:3001/api`
- ✅ `✅ Solicitud exitosa`

## 🐛 Problemas Comunes

### Problema 1: "Falta MONGODB_URI o MONGODB"

**Solución:**
1. Crea el archivo `.env` en la raíz del backend
2. Agrega: `MONGODB=mongodb://localhost:27017/paletacolores`

### Problema 2: "Error al conectar con MongoDB"

**Solución:**
1. Verifica que MongoDB esté corriendo
2. Verifica que la URL en el .env sea correcta
3. Si usas MongoDB Atlas, verifica las credenciales

### Problema 3: "Port 3001 is already in use"

**Solución:**
1. Cierra otros procesos que usen el puerto 3001
2. O cambia el puerto en el .env: `PORT=3002`
3. Actualiza el .env del frontend: `VITE_API_URL=http://localhost:3002/api`

### Problema 4: El backend inicia pero el frontend no se conecta

**Solución:**
1. Verifica que ambos estén corriendo
2. Verifica que el .env del frontend tenga: `VITE_API_URL=http://localhost:3001/api`
3. Reinicia el frontend después de cambiar el .env

## 📝 Comandos Rápidos

### Terminal 1 - Backend:
```bash
cd c:\Users\Usuario\Desktop\trabajos\administrarcolores_back
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd c:\Users\Usuario\Desktop\trabajos\administrarcolores
npm run dev
```

## ✅ Verificación Final

1. ✅ Backend corriendo en `http://localhost:3001`
2. ✅ Frontend corriendo en `http://localhost:5173`
3. ✅ MongoDB conectado (ver mensaje en consola del backend)
4. ✅ `http://localhost:3001/api/colores` responde JSON
5. ✅ La app carga colores sin errores

