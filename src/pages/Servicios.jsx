import { useState } from 'react'
import { FiPlus, FiX } from 'react-icons/fi'
import { tiposCita } from '../data/mockData'

export default function Servicios() {
  const [servicios, setServicios] = useState(tiposCita)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', duracion_minutos: '', descripcion: '' })

  const abrirModal = (servicio = null) => {
    if (servicio) {
      setEditando(servicio)
      setForm({
        nombre: servicio.nombre,
        duracion_minutos: servicio.duracion_minutos.toString(),
        descripcion: servicio.descripcion || '',
      })
    } else {
      setEditando(null)
      setForm({ nombre: '', duracion_minutos: '', descripcion: '' })
    }
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setEditando(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: enviar a API
    if (editando) {
      setServicios(prev =>
        prev.map(s =>
          s.tipo_cita_id === editando.tipo_cita_id
            ? { ...s, nombre: form.nombre, duracion_minutos: parseInt(form.duracion_minutos), descripcion: form.descripcion }
            : s
        )
      )
    } else {
      const nuevo = {
        tipo_cita_id: Date.now(),
        nombre: form.nombre,
        duracion_minutos: parseInt(form.duracion_minutos),
        descripcion: form.descripcion,
        activo: true,
      }
      setServicios(prev => [...prev, nuevo])
    }
    cerrarModal()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Servicios</h1>
          <p>{servicios.length} servicios configurados</p>
        </div>
        <button className="btn btn-primary" onClick={() => abrirModal()}>
          <FiPlus /> Nuevo servicio
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Duración</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map(s => (
                <tr key={s.tipo_cita_id}>
                  <td><strong>{s.nombre}</strong></td>
                  <td>{s.duracion_minutos} min</td>
                  <td>{s.descripcion || '—'}</td>
                  <td>
                    <span className={`badge ${s.activo ? 'badge-activo' : 'badge-inactivo'}`}>
                      {s.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-link" onClick={() => abrirModal(s)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editando ? 'Editar servicio' : 'Nuevo servicio'}</h2>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#6b7280' }}
                onClick={cerrarModal}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre del servicio *</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.nombre}
                  onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duración (minutos) *</label>
                <input
                  type="number"
                  className="form-control"
                  min="5"
                  max="480"
                  value={form.duracion_minutos}
                  onChange={e => setForm(prev => ({ ...prev, duracion_minutos: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.descripcion}
                  onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editando ? 'Guardar cambios' : 'Crear servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
