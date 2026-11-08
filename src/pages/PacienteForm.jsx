import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { pacientes } from '../data/mockData'

const tiposDocumento = ['DNI', 'Pasaporte', 'Carnet de Extranjería', 'Otro']
const sexoOpciones = ['Femenino', 'Masculino', 'No especificado', 'Prefiere no indicar']

export default function PacienteForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [form, setForm] = useState({
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    sexo: '',
    telefono: '',
    correo: '',
    direccion: '',
    contacto_emergencia: '',
    telefono_emergencia: '',
  })

  useEffect(() => {
    if (isEditing) {
      const paciente = pacientes.find(p => p.paciente_id === parseInt(id))
      if (paciente) {
        setForm({
          tipo_documento: paciente.tipo_documento,
          numero_documento: paciente.numero_documento,
          nombres: paciente.nombres,
          apellidos: paciente.apellidos,
          fecha_nacimiento: paciente.fecha_nacimiento || '',
          sexo: paciente.sexo || '',
          telefono: paciente.telefono || '',
          correo: paciente.correo || '',
          direccion: paciente.direccion || '',
          contacto_emergencia: paciente.contacto_emergencia || '',
          telefono_emergencia: paciente.telefono_emergencia || '',
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
    alert(`Paciente ${isEditing ? 'actualizado' : 'registrado'} (mock).`)
    navigate('/pacientes')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{isEditing ? 'Editar paciente' : 'Nuevo paciente'}</h1>
          <p>Complete los datos del paciente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card mb-3">
          <h3 className="card-title">Datos personales</h3>

          <div className="form-row form-row-3">
            <div className="form-group">
              <label className="form-label">Tipo de documento *</label>
              <select
                className="form-control"
                value={form.tipo_documento}
                onChange={e => handleChange('tipo_documento', e.target.value)}
                required
              >
                {tiposDocumento.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Número de documento *</label>
              <input
                type="text"
                className="form-control"
                value={form.numero_documento}
                onChange={e => handleChange('numero_documento', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sexo</label>
              <select
                className="form-control"
                value={form.sexo}
                onChange={e => handleChange('sexo', e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {sexoOpciones.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

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
              <label className="form-label">Fecha de nacimiento</label>
              <input
                type="date"
                className="form-control"
                value={form.fecha_nacimiento}
                onChange={e => handleChange('fecha_nacimiento', e.target.value)}
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

        <div className="card mb-3">
          <h3 className="card-title">Dirección y contacto de emergencia</h3>

          <div className="form-group">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              className="form-control"
              value={form.direccion}
              onChange={e => handleChange('direccion', e.target.value)}
            />
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Contacto de emergencia</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombre y parentesco"
                value={form.contacto_emergencia}
                onChange={e => handleChange('contacto_emergencia', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono de emergencia</label>
              <input
                type="tel"
                className="form-control"
                value={form.telefono_emergencia}
                onChange={e => handleChange('telefono_emergencia', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Guardar cambios' : 'Registrar paciente'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/pacientes')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
