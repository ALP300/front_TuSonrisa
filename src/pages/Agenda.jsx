import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import {
  citas, pacientes, odontologos, tiposCita, consultorios,
  getPacienteById, getOdontologoById, getTipoCitaById,
  formatTime, getEstadoBadgeClass, getEstadoDisplay
} from '../data/mockData'

const estadosCita = ['Programada', 'Confirmada', 'EnAtencion', 'Atendida', 'Cancelada', 'NoAsistio']

export default function Agenda() {
  const [fecha, setFecha] = useState('2026-10-22')
  const [filtroOdontologo, setFiltroOdontologo] = useState('')
  const [filtroConsultorio, setFiltroConsultorio] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  const citasFiltradas = useMemo(() => {
    return citas.filter(c => {
      const citaFecha = c.inicio.split('T')[0]
      if (citaFecha !== fecha) return false
      if (filtroOdontologo && c.odontologo_id !== parseInt(filtroOdontologo)) return false
      if (filtroConsultorio && c.consultorio !== filtroConsultorio) return false
      if (filtroEstado && c.estado !== filtroEstado) return false
      return true
    }).sort((a, b) => a.inicio.localeCompare(b.inicio))
  }, [fecha, filtroOdontologo, filtroConsultorio, filtroEstado])

  const fechaFormateada = new Date(fecha + 'T12:00:00').toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Agenda de citas</h1>
          <p style={{ textTransform: 'capitalize' }}>
            {fechaFormateada} · {citasFiltradas.length} cita{citasFiltradas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/agenda/nueva-cita" className="btn btn-primary">
          <FiPlus /> Nueva cita
        </Link>
      </div>

      <div className="filters-bar">
        <div className="form-group">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Odontólogo</label>
          <select className="form-control" value={filtroOdontologo} onChange={e => setFiltroOdontologo(e.target.value)}>
            <option value="">Todos</option>
            {odontologos.map(o => (
              <option key={o.odontologo_id} value={o.odontologo_id}>
                Dr(a). {o.nombres} {o.apellidos}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Consultorio</label>
          <select className="form-control" value={filtroConsultorio} onChange={e => setFiltroConsultorio(e.target.value)}>
            <option value="">Todos</option>
            {consultorios.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Estado</label>
          <select className="form-control" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            {estadosCita.map(e => (
              <option key={e} value={e}>{getEstadoDisplay(e)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Paciente</th>
                <th>Servicio</th>
                <th>Odontólogo</th>
                <th>Consultorio</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No hay citas para los filtros seleccionados
                  </td>
                </tr>
              ) : (
                citasFiltradas.map(cita => {
                  const paciente = getPacienteById(cita.paciente_id)
                  const odontologo = getOdontologoById(cita.odontologo_id)
                  const tipoCita = getTipoCitaById(cita.tipo_cita_id)
                  return (
                    <tr key={cita.cita_id}>
                      <td>
                        <strong>{formatTime(cita.inicio)} – {formatTime(cita.fin)}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{paciente?.nombres} {paciente?.apellidos}</strong>
                          <br />
                          <span className="text-muted text-sm">
                            {paciente?.tipo_documento} {paciente?.numero_documento}
                          </span>
                        </div>
                      </td>
                      <td>{tipoCita?.nombre || '—'}</td>
                      <td>Dra. {odontologo?.nombres} {odontologo?.apellidos}</td>
                      <td>{cita.consultorio}</td>
                      <td>
                        <span className={`badge ${getEstadoBadgeClass(cita.estado)}`}>
                          {getEstadoDisplay(cita.estado)}
                        </span>
                      </td>
                      <td>
                        <button className="btn-link">Abrir</button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
