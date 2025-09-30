import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [colores, setColores] = useState([
    { id: 1, nombre: "Nombre color", valor: "blue" },
    { id: 2, nombre: "Nombre color", valor: "peachpuff" },
    { id: 3, nombre: "Nombre color", valor: "pink" }
  ]);

  const [nuevoColor, setNuevoColor] = useState("");

  // Agregar color
  const agregarColor = () => {
    if (!nuevoColor) return;

    const nuevo = {
      id: Date.now(),
      nombre: "Nombre color",
      valor: nuevoColor
    };

    setColores([...colores, nuevo]);
    setNuevoColor("");
  };

  // Eliminar color
  const borrarColor = (id) => {
    setColores(colores.filter((c) => c.id !== id));
  };

  return (
    <div className="container py-4">
      {/* Formulario */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">Administrar colores</div>
        <div className="card-body bg-light d-flex align-items-center">
          <div
            className="me-3"
            style={{
              width: "70px",
              height: "70px",
              background: nuevoColor || "#ccc",
              border: "1px solid #aaa"
            }}
          ></div>
          <input
            type="text"
            placeholder="Ingrese un color ej Blue"
            className="form-control me-3"
            value={nuevoColor}
            onChange={(e) => setNuevoColor(e.target.value)}
          />
          <button className="btn btn-primary" onClick={agregarColor}>
            Guardar
          </button>
        </div>
      </div>

      {/* Lista de colores */}
      <div className="row">
        {colores.map((color) => (
          <div className="col-md-3 mb-3" key={color.id}>
            <div className="card shadow-sm text-center">
              <div className="card-header">{color.nombre}</div>
              <div
                className="mx-auto my-2 border"
                style={{
                  width: "100px",
                  height: "100px",
                  background: color.valor
                }}
              ></div>
              <div className="card-footer">
                <button
                  className="btn btn-danger w-100"
                  onClick={() => borrarColor(color.id)}
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;