import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  pacientes, odontologos, tiposCita, consultorios,
  getPacienteById
} from '../data/mockData'

const horariosBase = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30'
]

// Simulated occupied slots
const ocupados = ['09:00', '09:30', '11:00']

export default function NuevaCita() {
  const navigate = useNavigate()
  const [dniBuscar, setDniBuscar] = useState('')
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null)
  const [tipoCitaId, setTipoCitaId] = useState('')
  const [odontologoId, setOdontologoId] = useState('')
  const [consultorio, setConsultorio] = useState('')
  const [fecha, setFecha] = useState('')
  const [horaSeleccionada, setHoraSeleccionada] = useState('')
  const [motivo, setMotivo] = useState('')

  const buscarPaciente = () => {
    const found = pacientes.find(p => p.numero_documento === dniBuscar)
    setPacienteEncontrado(found || null)
    if (!found) {
      alert('Paciente no encontrado. Puede registrar uno nuevo.')
    }
  }

  const tipoCitaSeleccionada = tiposCita.find(t => t.tipo_cita_id === parseInt(tipoCitaId))
  const odontologoSeleccionado = odontologos.find(o => o.odontologo_id === parseInt(odontologoId))

  const calcularFin = () => {
    if (!horaSeleccionada || !tipoCitaSeleccionada) return ''
    const [h, m] = horaSeleccionada.split(':').map(Number)
    const totalMin = h * 60 + m + tipoCitaSeleccionada.duracion_minutos
    const fh = Math.floor(totalMin / 60).toString().padStart(2, '0')
    const fm = (totalMin % 60).toString().padStart(2, '0')
    return `${fh}:${fm}`
  }

  const handleGuardar = () => {
    // TODO: enviar a API
    alert('Cita guardada (mock). Se conectará con la API.')
    navigate('/agenda')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Nueva cita</h1>
          <p>Los horarios en gris ya están ocupados para ese odontólogo</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Step 1: Patient */}
          <div className="card">
            <h2 className="card-title">1. Paciente</h2>

            <div className="form-group">
              <label className="form-label">Buscar por DNI</label>
              <div className="search-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Número de documento"
                  value={dniBuscar}
                  onChange={e => setDniBuscar(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && buscarPaciente()}
                />
                <button className="btn btn-secondary" onClick={buscarPaciente}>
                  Buscar
                </button>
              </div>
            </div>

            {pacienteEncontrado && (
              <div className="form-row form-row-2">
                <div className="form-group">
                  <label className="form-label">Nombres y apellidos</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`${pacienteEncontrado.nombres} ${pacienteEncontrado.apellidos}`}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pacienteEncontrado.telefono || ''}
                    readOnly
                  />
                </div>
              </div>
            )}

            <button
              className="btn-link"
              style={{ marginTop: '8px' }}
              onClick={() => navigate('/pacientes/nuevo')}
            >
              Registrar paciente nuevo
            </button>
          </div>

          {/* Step 2: Appointment details */}
          <div className="card">
            <h2 className="card-title">2. Datos de la cita</h2>

            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Servicio</label>
                <select className="form-control" value={tipoCitaId} onChange={e => setTipoCitaId(e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {tiposCita.filter(t => t.activo).map(t => (
                    <option key={t.tipo_cita_id} value={t.tipo_cita_id}>{t.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Odontólogo</label>
                <select className="form-control" value={odontologoId} onChange={e => setOdontologoId(e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {odontologos.filter(o => o.estado === 'Activo').map(o => (
                    <option key={o.odontologo_id} value={o.odontologo_id}>
                      Dra. {o.nombres} {o.apellidos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Consultorio</label>
                <select className="form-control" value={consultorio} onChange={e => setConsultorio(e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {consultorios.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  className="form-control"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Horario disponible</label>
              <div className="time-slots">
                {horariosBase.map(hora => {
                  const isOcupado = ocupados.includes(hora)
                  return (
                    <button
                      key={hora}
                      className={`time-slot ${horaSeleccionada === hora ? 'selected' : ''} ${isOcupado ? 'disabled' : ''}`}
                      onClick={() => !isOcupado && setHoraSeleccionada(hora)}
                      disabled={isOcupado}
                    >
                      {hora}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Motivo de la cita</label>
              <textarea
                className="form-control"
                rows={3}
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                placeholder="Describa el motivo de la consulta..."
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Summary */}
        <div className="summary-card">
          <h3 className="card-title">Resumen de la cita</h3>

          <div className="summary-row">
            <span className="label">Paciente</span>
            <span className="value">
              {pacienteEncontrado
                ? `${pacienteEncontrado.nombres} ${pacienteEncontrado.apellidos}`
                : '—'}
            </span>
          </div>
          <div className="summary-row">
            <span className="label">Servicio</span>
            <span className="value">{tipoCitaSeleccionada?.nombre || '—'}</span>
          </div>
          <div className="summary-row">
            <span className="label">Duración (según servicio)</span>
            <span className="value">
              {tipoCitaSeleccionada ? `${tipoCitaSeleccionada.duracion_minutos} min` : '—'}
            </span>
          </div>
          <div className="summary-row">
            <span className="label">Odontólogo</span>
            <span className="value">
              {odontologoSeleccionado
                ? `Dra. ${odontologoSeleccionado.nombres} ${odontologoSeleccionado.apellidos}`
                : '—'}
            </span>
          </div>
          <div className="summary-row">
            <span className="label">Consultorio</span>
            <span className="value">{consultorio || '—'}</span>
          </div>
          <div className="summary-row">
            <span className="label">Fecha y hora</span>
            <span className="value">
              {fecha && horaSeleccionada
                ? `${fecha} · ${horaSeleccionada} – ${calcularFin()}`
                : '—'}
            </span>
          </div>
          <div className="summary-row">
            <span className="label">Estado inicial</span>
            <span className="value">
              <span className="badge badge-programada">Programada</span>
            </span>
          </div>

          <hr className="divider" />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleGuardar}
              disabled={!pacienteEncontrado || !tipoCitaId || !odontologoId || !fecha || !horaSeleccionada}
            >
              Guardar cita
            </button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => navigate('/agenda')}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
