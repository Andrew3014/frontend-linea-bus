import { useState } from 'react';

export default function StepDirecciones({ linea, direcciones, onDireccionCreated }) {
  const [form, setForm] = useState({
    direction: 'outbound',
    headsign: '',
    avg_speed_kmh: 20,
    wait_minutes: 5,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!linea) return <div>Selecciona una línea primero.</div>;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, line_id: linea.id })
      });
      const data = await res.json();
      if (res.ok) {
        onDireccionCreated(data.direction);
        setForm({ direction: 'outbound', headsign: '', avg_speed_kmh: 20, wait_minutes: 5, is_active: true });
      } else {
        setError(data.error || 'Error al crear dirección');
      }
    } catch (err) {
      setError('Error de red');
    }
    setLoading(false);
  };

  return (
    <div className="step-direcciones">
      <h2>Direcciones de la línea</h2>
      <form onSubmit={handleSubmit}>
        <select name="direction" value={form.direction} onChange={handleChange}>
          <option value="outbound">Ida</option>
          <option value="inbound">Vuelta</option>
        </select>
        <input name="headsign" placeholder="Etiqueta (headsign)" value={form.headsign} onChange={handleChange} required />
        <input name="avg_speed_kmh" type="number" min="1" max="100" value={form.avg_speed_kmh} onChange={handleChange} />
        <input name="wait_minutes" type="number" min="0" max="60" value={form.wait_minutes} onChange={handleChange} />
        <label>
          <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} /> Activa
        </label>
        <button type="submit" disabled={loading}>Crear/Actualizar dirección</button>
        {error && <div className="error">{error}</div>}
      </form>
      <div className="direcciones-list">
        <h3>Direcciones existentes</h3>
        <ul>
          {direcciones.map(d => (
            <li key={d.id}>
              {d.direction} ({d.headsign}) {d.is_active ? '✔️' : '❌'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
