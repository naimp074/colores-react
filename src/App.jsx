import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  obtenerColores,
  agregarColor as agregarColorAPI,
  editarColor as editarColorAPI,
  eliminarColor as eliminarColorAPI,
} from "./services/api";

function App() {
  const [colores, setColores] = useState([]);
  const [nombreColor, setNombreColor] = useState("");
  const [hexColor, setHexColor] = useState("");
  const [rgbColor, setRgbColor] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(false);

  // Función auxiliar para obtener el valor de color a mostrar
  const obtenerValorColor = (color) => {
    if (color.hex) return color.hex;
    if (color.rgb) return color.rgb;
    return "#ccc";
  };

  // Función para convertir nombre de color a hex y rgb
  const convertirNombreAColor = (nombre) => {
    if (!nombre || !nombre.trim()) return null;

    try {
      const nombreLimpio = nombre.trim();
      
      // Crear un elemento temporal para obtener el color
      const tempDiv = document.createElement("div");
      tempDiv.style.color = nombreLimpio;
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.width = "1px";
      tempDiv.style.height = "1px";
      document.body.appendChild(tempDiv);
      
      const colorComputado = window.getComputedStyle(tempDiv).color;
      document.body.removeChild(tempDiv);

      // Si no se obtuvo un color válido, retornar null
      if (!colorComputado) return null;

      // Extraer valores RGB del color computado
      const rgbMatch = colorComputado.match(/\d+/g);
      if (!rgbMatch || rgbMatch.length < 3) return null;

      const r = parseInt(rgbMatch[0]);
      const g = parseInt(rgbMatch[1]);
      const b = parseInt(rgbMatch[2]);
      const a = rgbMatch[3] ? parseFloat(rgbMatch[3]) : 1;

      // Verificar si el color es válido (no es transparente o inválido)
      // Si el color es rgb(0,0,0) y no es "black", podría ser un error
      if (r === 0 && g === 0 && b === 0 && nombreLimpio.toLowerCase() !== "black") {
        // Verificar con canvas como respaldo
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = nombreLimpio;
        // Si canvas no acepta el color, retornar null
        if (ctx.fillStyle === nombreLimpio) {
          return null;
        }
        // Si canvas aceptó el color, usar ese valor
        const tempDiv2 = document.createElement("div");
        tempDiv2.style.color = ctx.fillStyle;
        tempDiv2.style.position = "absolute";
        tempDiv2.style.visibility = "hidden";
        document.body.appendChild(tempDiv2);
        const colorCanvas = window.getComputedStyle(tempDiv2).color;
        document.body.removeChild(tempDiv2);
        
        const rgbMatch2 = colorCanvas.match(/\d+/g);
        if (!rgbMatch2 || rgbMatch2.length < 3) return null;
        
        const r2 = parseInt(rgbMatch2[0]);
        const g2 = parseInt(rgbMatch2[1]);
        const b2 = parseInt(rgbMatch2[2]);
        const a2 = rgbMatch2[3] ? parseFloat(rgbMatch2[3]) : 1;
        
        const toHex = (n) => {
          const hex = n.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        };
        const hex = `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
        const rgb = a2 < 1 ? `rgba(${r2}, ${g2}, ${b2}, ${a2})` : `rgb(${r2}, ${g2}, ${b2})`;
        
        return { hex, rgb };
      }

      // Convertir a hex
      const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

      // Crear string RGB/RGBA
      const rgb = a < 1 
        ? `rgba(${r}, ${g}, ${b}, ${a})`
        : `rgb(${r}, ${g}, ${b})`;

      return { hex, rgb };
    } catch (error) {
      return null;
    }
  };

  // Cargar colores al montar el componente
  useEffect(() => {
    cargarColores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarColores = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerColores();
      setColores(datos);
    } catch (err) {
      setError(err.message || "Error al cargar los colores");
      console.error("Error al cargar colores:", err);
    } finally {
      setCargando(false);
    }
  };

  // Agregar color
  const agregarColor = async () => {
    // El nombre debe tener valor (puede ser el hex o rgb si se ingresó)
    const nombreFinal = nombreColor.trim() || hexColor.trim() || rgbColor.trim();
    if (!nombreFinal) {
      alert("Debe ingresar al menos un nombre o un código de color (hex/rgb)");
      return;
    }

    try {
      setProcesando(true);
      setError(null);
      const nuevoColor = await agregarColorAPI({
        nombre: nombreFinal,
        hex: hexColor.trim() || undefined,
        rgb: rgbColor.trim() || undefined,
      });
      setColores([...colores, nuevoColor]);
      setNombreColor("");
      setHexColor("");
      setRgbColor("");
    } catch (err) {
      setError(err.message || "Error al agregar el color");
      alert(err.message || "Error al agregar el color");
    } finally {
      setProcesando(false);
    }
  };

  // Editar color
  const editarColor = (id) => {
    const color = colores.find((c) => c.id === id);
    if (color) {
      setEditandoId(id);
      setNombreColor(color.nombre || "");
      setHexColor(color.hex || "");
      setRgbColor(color.rgb || "");
    }
  };

  // Guardar edición
  const guardarEdicion = async () => {
    // El nombre debe tener valor (puede ser el hex o rgb si se ingresó)
    const nombreFinal = nombreColor.trim() || hexColor.trim() || rgbColor.trim();
    if (!nombreFinal) {
      alert("Debe ingresar al menos un nombre o un código de color (hex/rgb)");
      return;
    }

    try {
      setProcesando(true);
      setError(null);
      const colorActualizado = await editarColorAPI(editandoId, {
        nombre: nombreFinal,
        hex: hexColor.trim() || undefined,
        rgb: rgbColor.trim() || undefined,
      });
      setColores(
        colores.map((c) => (c.id === editandoId ? colorActualizado : c))
      );
      setEditandoId(null);
      setNombreColor("");
      setHexColor("");
      setRgbColor("");
    } catch (err) {
      setError(err.message || "Error al editar el color");
      alert(err.message || "Error al editar el color");
    } finally {
      setProcesando(false);
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombreColor("");
    setHexColor("");
    setRgbColor("");
  };

  // Obtener paleta de colores
  const obtenerPaleta = () => {
    return colores;
  };

  // Eliminar color
  const borrarColor = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este color?")) {
      return;
    }

    try {
      setProcesando(true);
      setError(null);
      await eliminarColorAPI(id);
      setColores(colores.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message || "Error al eliminar el color");
      alert(err.message || "Error al eliminar el color");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Mensaje de error */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Formulario */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">
          {editandoId ? "Editar color" : "Administrar colores"}
        </div>
        <div className="card-body bg-light">
          <div className="row align-items-end mb-3">
            <div className="col-md-1">
              <div
                className="mx-auto"
                style={{
                  width: "70px",
                  height: "70px",
                  background: hexColor || rgbColor || nombreColor || "#ccc",
                  border: "1px solid #aaa",
                  borderRadius: "4px"
                }}
              ></div>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Nombre *</label>
              <input
                type="text"
                placeholder="Nombre del color (ej: blue, red)"
                className="form-control"
                value={nombreColor}
                onChange={(e) => {
                  const valor = e.target.value;
                  setNombreColor(valor);
                  
                  // Intentar convertir el nombre a color
                  const colorConvertido = convertirNombreAColor(valor);
                  if (colorConvertido) {
                    // Completar automáticamente hex y rgb cuando se detecta un nombre de color válido
                    setHexColor(colorConvertido.hex);
                    setRgbColor(colorConvertido.rgb);
                  }
                }}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small">Hex (opcional)</label>
              <input
                type="text"
                placeholder="#000000"
                className="form-control"
                value={hexColor}
                onChange={(e) => {
                  setHexColor(e.target.value);
                  // Si el nombre está vacío, completarlo con el hex
                  if (!nombreColor.trim()) {
                    setNombreColor(e.target.value);
                  }
                }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small">RGB/RGBA (opcional)</label>
              <input
                type="text"
                placeholder="rgb(0, 0, 0) o rgba(0, 0, 0, 1)"
                className="form-control"
                value={rgbColor}
                onChange={(e) => {
                  setRgbColor(e.target.value);
                  // Si el nombre está vacío, completarlo con el rgb
                  if (!nombreColor.trim()) {
                    setNombreColor(e.target.value);
                  }
                }}
              />
            </div>
            <div className="col-md-4">
              {editandoId ? (
                <>
                  <button
                    className="btn btn-success me-2"
                    onClick={guardarEdicion}
                    disabled={procesando}
                  >
                    {procesando ? "Guardando..." : "Guardar cambios"}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={cancelarEdicion}
                    disabled={procesando}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={agregarColor}
                  disabled={procesando}
                >
                  {procesando ? "Agregando..." : "Agregar color"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Información de paleta */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Paleta de colores ({colores.length} colores)</span>
          <button
            className="btn btn-sm btn-info"
            onClick={() => {
              const paleta = obtenerPaleta();
              console.log("Paleta de colores:", paleta);
              alert(`Paleta obtenida: ${paleta.length} colores\nVer consola para detalles`);
            }}
          >
            Obtener paleta
          </button>
        </div>
      </div>

      {/* Lista de colores */}
      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando colores...</p>
        </div>
      ) : colores.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay colores en la paleta. Agrega tu primer color arriba.
        </div>
      ) : (
        <div className="row">
          {colores.map((color) => (
          <div className="col-md-3 mb-3" key={color.id}>
            <div className="card shadow-sm">
              <div className="card-header text-center">
                <strong>{color.nombre}</strong>
                <br />
                <small className="text-muted">ID: {color.id}</small>
              </div>
              <div
                className="mx-auto my-3 border"
                style={{
                  width: "100px",
                  height: "100px",
                  background: obtenerValorColor(color),
                  borderRadius: "4px"
                }}
              ></div>
              <div className="card-body">
                <div className="small">
                  {color.hex && (
                    <div className="mb-2">
                      <strong>Hex:</strong> 
                      <code className="ms-1">{color.hex}</code>
                    </div>
                  )}
                  {color.rgb && (
                    <div>
                      <strong>RGB:</strong> 
                      <code className="ms-1">{color.rgb}</code>
                    </div>
                  )}
                  {!color.hex && !color.rgb && (
                    <div className="text-muted">Sin código de color</div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => editarColor(color.id)}
                    disabled={editandoId === color.id || procesando}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => borrarColor(color.id)}
                    disabled={editandoId === color.id || procesando}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

export default App;