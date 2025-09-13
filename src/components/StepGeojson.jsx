import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'TU_MAPBOX_TOKEN_AQUI'; // Reemplaza por tu token real

function parseGeojson(file, cb) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const geojson = JSON.parse(reader.result);
      cb(null, geojson);
    } catch (err) {
      cb('Archivo inválido');
    }
  };
  reader.readAsText(file);
}

function getSegments(geojson) {
  let segments = [];
  if (geojson.type === 'FeatureCollection') {
    geojson.features.forEach((f, i) => {
      if (f.geometry.type === 'LineString') {
        segments.push({ seq: i + 1, coordinates: f.geometry.coordinates });
      } else if (f.geometry.type === 'MultiLineString') {
        f.geometry.coordinates.forEach((coords, j) => {
          segments.push({ seq: segments.length + 1, coordinates: coords });
        });
      }
    });
  } else if (geojson.type === 'Feature' && geojson.geometry) {
    if (geojson.geometry.type === 'LineString') {
      segments.push({ seq: 1, coordinates: geojson.geometry.coordinates });
    } else if (geojson.geometry.type === 'MultiLineString') {
      geojson.geometry.coordinates.forEach((coords, j) => {
        segments.push({ seq: j + 1, coordinates: coords });
      });
    }
  }
  return segments;
}

const ejemploIda = {
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [-66.149305, -17.394006],
          [-66.149934, -17.390964],
          [-66.158804, -17.392645],
          [-66.159811, -17.387323],
          [-66.158657, -17.387122],
          [-66.158909, -17.385982]
        ],
        "type": "LineString"
      },
      "id": "bf2748f43ca08bcdd8e9fc66270e9681"
    }
  ],
  "type": "FeatureCollection"
};

const ejemploVuelta = {
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [-66.159507, -17.389496],
          [-66.158832, -17.392624],
          [-66.155573, -17.39216],
          [-66.15473, -17.396414]
        ],
        "type": "LineString"
      },
      "id": "5e14dc4ff63a3aebd6cd860062e5c56c"
    }
  ],
  "type": "FeatureCollection"
};

export default function StepGeojson({ lineDirectionId, color }) {
  const [segments, setSegments] = useState([]);
  const [geojsonError, setGeojsonError] = useState('');
  const [fileName, setFileName] = useState('');
  const [saving, setSaving] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const fileInputRef = useRef();

  // Previsualización en el mapa
  useEffect(() => {
    if (!mapContainer.current) return;
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-66.1653, -17.3895],
        zoom: 12,
      });
    }
    // Limpiar capas previas
    if (map.current.getSource('preview')) {
      if (map.current.getLayer('preview-line')) map.current.removeLayer('preview-line');
      map.current.removeSource('preview');
    }
    if (segments.length > 0) {
      const geojson = {
        type: 'FeatureCollection',
        features: segments.map(seg => ({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: seg.coordinates },
        }))
      };
      map.current.addSource('preview', {
        type: 'geojson',
        data: geojson
      });
      map.current.addLayer({
        id: 'preview-line',
        type: 'line',
        source: 'preview',
        paint: {
          'line-color': color || '#FF5722',
          'line-width': 4
        }
      });
      // Ajustar vista al primer segmento
      const coords = segments[0].coordinates;
      if (coords && coords.length > 0) {
        map.current.flyTo({ center: coords[0], zoom: 13 });
      }
    }
    // eslint-disable-next-line
  }, [segments, color]);

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    parseGeojson(file, (err, geojson) => {
      if (err) {
        setGeojsonError(err);
        setSegments([]);
        return;
      }
      const segs = getSegments(geojson);
      if (segs.length === 0) {
        setGeojsonError('No se encontraron líneas válidas');
        setSegments([]);
        return;
      }
      setGeojsonError('');
      setSegments(segs);
    });
  };

  const handleDrop = e => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile({ target: { files: [e.dataTransfer.files[0]] } });
    }
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleSave = async () => {
    setSaving(true);
    for (const seg of segments) {
      const res = await fetch('http://localhost:3000/shapes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line_direction_id: lineDirectionId,
          seq: seg.seq,
          upsert: true,
          coordinates: seg.coordinates
        })
      });
      if (!res.ok) {
        setGeojsonError('Error al guardar segmento');
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    alert('Rutas guardadas correctamente');
  };

  // Métricas
  const totalLength = segments.reduce((acc, seg) => acc + seg.coordinates.length, 0);

  return (
    <div className="step-geojson">
      <h2>Cargar ruta (.geojson)</h2>
      <input
        type="file"
        accept=".geojson,.json"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFile}
      />
      <button onClick={() => fileInputRef.current.click()}>
        Seleccionar archivo .geojson
      </button>
      <div
        style={{ border: '2px dashed #888', padding: '1em', margin: '1em 0', borderRadius: '8px', background: '#222', color: '#fff', cursor: 'pointer' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        Arrastra aquí tu archivo .geojson
      </div>
      <button style={{marginLeft:'1em'}} onClick={() => {
        setFileName('linea-prueba.geojson');
        setGeojsonError('');
        setSegments(getSegments(ejemploIda));
      }}>Cargar ejemplo Ida</button>
      <button style={{marginLeft:'1em'}} onClick={() => {
        setFileName('linea-prueba-vuelta.geojson');
        setGeojsonError('');
        setSegments(getSegments(ejemploVuelta));
      }}>Cargar ejemplo Vuelta</button>
      {fileName && <div>Archivo: {fileName}</div>}
      {geojsonError && <div className="error">{geojsonError}</div>}
      <div ref={mapContainer} style={{ width: '100%', height: '300px', margin: '1em 0', borderRadius: '8px' }} />
      <ul>
        {segments.map(seg => (
          <li key={seg.seq}>
            Segmento {seg.seq} - {seg.coordinates.length} puntos
            <button onClick={() => {
              setSegments(segs => segs.filter(s => s.seq !== seg.seq));
            }}>Eliminar</button>
            <button onClick={() => {
              setSegments(segs => segs.map(s => s.seq === seg.seq ? { ...s, coordinates: [...s.coordinates].reverse() } : s));
            }}>Invertir sentido</button>
          </li>
        ))}
      </ul>
      <div style={{marginTop: '1em', fontSize: '0.9em'}}>
        <b>Métricas:</b> {segments.length} segmento(s), {totalLength} puntos totales.<br/>
        <b>Formato aceptado:</b> FeatureCollection con geometrías LineString/MultiLineString.<br/>
        Ejemplo:<br/>
        <pre style={{background:'#222',color:'#fff',padding:'0.5em'}}>{`{
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [[-66.159507, -17.389496], ...]
      }
    }
  ],
  "type": "FeatureCollection"
}`}</pre>
      </div>
      <button onClick={handleSave} disabled={saving || !segments.length}>Guardar shapes</button>
    </div>
  );
}
