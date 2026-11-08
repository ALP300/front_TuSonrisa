import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { odontologos } from '../data/mockData'

const tiposDocumento = ['DNI', 'Pasaporte', 'Carnet de Extranjería', 'Otro']

export default function OdontologoForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [form, setForm] = useState({
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    numero_colegiatura: '',
    especialidad: '',
    telefono: '',
    correo: '',
  })

  useEffect(() => {
    if (isEditing) {
      const odontologo = odontologos.find(o => o.odontologo_id === parseInt(id))
      if (odontologo) {
        setForm({
          tipo_documento: odontologo.tipo_documento || 'DNI',
          numero_documento: odontologo.numero_documento || '',
          nombres: odontologo.nombres,
          apellidos: odontologo.apellidos,
          numero_colegiatura: odontologo.numero_colegiatura || '',
          especialidad: odontologo.especialidad || '',
          telefono: odontologo.telefono || '',
          correo: odontologo.correo || '',
        })
      }
    }
  }, [id, isEditing])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: enviar a API
    alert(`Odontólogo ${isEditing ? 'actualizado' : 'registrado'} (mock).`)
    navigate('/odontologos')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{isEditing ? 'Editar odontólogo' : 'Nuevo odontólogo'}</h1>
          <p>Complete los datos del profesional</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card mb-3">
          <h3 className="card-title">Datos del profesional</h3>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Nombres *</label>
              <input
                type="text"
                className="form-control"
                value={form.nombres}
                onChange={e => handleChange('nombres', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Apellidos *</label>
              <input
                type="text"
                className="form-control"
                value={form.apellidos}
                onChange={e => handleChange('apellidos', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row form-row-3">
            <div className="form-group">
              <label className="form-label">Tipo de documento</label>
              <select
                className="form-control"
                value={form.tipo_documento}
                onChange={e => handleChange('tipo_documento', e.target.value)}
              >
                {tiposDocumento.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Número de documento</label>
              <input
                type="text"
                className="form-control"
                value={form.numero_documento}
                onChange={e => handleChange('numero_documento', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">N° Colegiatura</label>
              <input
                type="text"
                className="form-control"
                placeholder="COP-XXXXX"
                value={form.numero_colegiatura}
                onChange={e => handleChange('numero_colegiatura', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row form-row-3">
            <div className="form-group">
              <label className="form-label">Especialidad</label>
              <input
                type="text"
                className="form-control"
                value={form.especialidad}
                onChange={e => handleChange('especialidad', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-control"
                value={form.telefono}
                onChange={e => handleChange('telefono', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={form.correo}
                onChange={e => handleChange('correo', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Guardar cambios' : 'Registrar odontólogo'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/odontologos')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
