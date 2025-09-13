import { useState } from 'react';

export default function StepLinea({ onLineaCreated, onSelectLinea, lineas, selectedLinea }) {
  const [form, setForm] = useState({ code: '', name: '', color_hex: '#FF5722', is_active: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateColor = hex => /^#[0-9A-Fa-f]{6}$/.test(hex);
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!form.code || !form.name || !validateColor(form.color_hex)) {
      setError('Completa todos los campos y usa un color válido (#RRGGBB)');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        onLineaCreated(data.line);
        setForm({ code: '', name: '', color_hex: '#FF5722', is_active: true });
      } else {
        setError(data.error || 'Error al crear línea');
      }
    } catch (err) {
      setError('Error de red');
    }
    setLoading(false);
  };

  return (
    <div className="step-linea">
      <h2>Líneas</h2>
      <form onSubmit={handleSubmit}>
        <input name="code" placeholder="Código" value={form.code} onChange={handleChange} required />
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <input name="color_hex" type="color" value={form.color_hex} onChange={handleChange} />
        <label>
          <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} /> Activa
        </label>
        <button type="submit" disabled={loading}>Crear línea</button>
        {error && <div className="error">{error}</div>}
      </form>
      <div className="lineas-list">
        <h3>Existentes</h3>
        <ul>
          {lineas.map(l => (
            <li key={l.id}>
              <button style={{ background: l.color_hex }} onClick={() => onSelectLinea(l)}>
                {l.name} ({l.code}) {l.is_active ? '✔️' : '❌'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
