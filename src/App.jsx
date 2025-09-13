
import { useEffect, useState } from 'react';
import StepLinea from './components/StepLinea';
import StepDirecciones from './components/StepDirecciones';
import StepGeojson from './components/StepGeojson';
import './App.css';

function App() {
  const [lineas, setLineas] = useState([]);
  const [selectedLinea, setSelectedLinea] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [selectedDireccion, setSelectedDireccion] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/lines')
      .then(res => res.json())
      .then(data => setLineas(data.lines || []));
  }, []);

  useEffect(() => {
    if (!selectedLinea) return;
    fetch(`http://localhost:3000/directions?line_id=${selectedLinea.id}`)
      .then(res => res.json())
      .then(data => setDirecciones(data.directions || []));
  }, [selectedLinea]);

  return (
    <div className="main-container">
      <h1>Gestión de Líneas de Buses</h1>
      <StepLinea
        lineas={lineas}
        selectedLinea={selectedLinea}
        onLineaCreated={l => setLineas(ls => [...ls, l])}
        onSelectLinea={l => { setSelectedLinea(l); setSelectedDireccion(null); }}
      />
      {selectedLinea && (
        <StepDirecciones
          linea={selectedLinea}
          direcciones={direcciones}
          onDireccionCreated={d => setDirecciones(ds => [...ds, d])}
        />
      )}
      {selectedLinea && direcciones.length > 0 && (
        <div className="geojson-panels">
          {direcciones.map(dir => (
            <div key={dir.id}>
              <h3>{dir.direction === 'outbound' ? 'Ida' : 'Vuelta'} ({dir.headsign})</h3>
              <StepGeojson lineDirectionId={dir.id} color={selectedLinea.color_hex} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
