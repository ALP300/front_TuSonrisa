import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import {
  pacientes, historiasClinicas, atenciones,
  calcularEdad, formatDate, getEstadoBadgeClass, getEstadoDisplay
} from '../data/mockData'

export default function HistoriaClinicaDetalle() {
  const { id } = useParams()
  const pacienteId = parseInt(id)

  const paciente = pacientes.find(p => p.paciente_id === pacienteId)
  const historia = historiasClinicas.find(hc => hc.paciente_id === pacienteId)
  const atencionesHC = useMemo(() => {
    if (!historia) return []
    return atenciones
      .filter(a => a.historia_clinica_id === historia.historia_clinica_id)
      .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))
  }, [historia])

  if (!paciente || !historia) {
    return (
      <div className="empty-state">
        <p>Historia clínica no encontrada</p>
        <Link to="/historias-clinicas" className="btn btn-secondary mt-2">
          Volver a historias clínicas
        </Link>
      </div>
    )
  }

  const edad = paciente.fecha_nacimiento ? calcularEdad(paciente.fecha_nacimiento) : null
  const iniciales = `${paciente.nombres[0]}${paciente.apellidos[0]}`

  return (
    <div>
      {/* Patient Header */}
      <div className="patient-header">
        <div className="avatar">{iniciales}</div>
        <div className="patient-header-info" style={{ flex: 1 }}>
          <h1>{paciente.nombres} {paciente.apellidos}</h1>
          <p>
            HC N° {historia.numero} · {paciente.tipo_documento} {paciente.numero_documento}
            {edad !== null && ` · ${edad} años (calculado)`}
            {paciente.sexo && ` · ${paciente.sexo}`}
          </p>
        </div>
        <Link
          to={`/historias-clinicas/${pacienteId}/nueva-atencion`}
          className="btn btn-primary"
        >
          <FiPlus /> Nueva atención
        </Link>
      </div>

      {/* Two columns: Filiación + Antecedentes */}
      <div className="two-cols mb-3">
        <div className="card">
          <h3 className="card-title">Filiación</h3>
          <div className="detail-row">
            <span className="detail-label">Lugar y fecha de nacimiento</span>
            <span className="detail-value">
              Lima · {paciente.fecha_nacimiento ? formatDate(paciente.fecha_nacimiento) : '—'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Dirección</span>
            <span className="detail-value">{paciente.direccion || '—'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Teléfono</span>
            <span className="detail-value">{paciente.telefono || '—'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Correo</span>
            <span className="detail-value">{paciente.correo || '—'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Contacto de emergencia</span>
            <span className="detail-value">
              {paciente.contacto_emergencia
                ? `${paciente.contacto_emergencia} · ${paciente.telefono_emergencia || ''}`
                : '—'}
            </span>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Antecedentes</h3>
          <div className="form-group">
            <label className="form-label">Antecedentes familiares</label>
            <textarea
              className="form-control"
              rows={3}
              value={historia.antecedentes_familiares || ''}
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="form-label">Antecedentes personales</label>
            <textarea
              className="form-control"
              rows={3}
              value={historia.antecedentes_odontologicos || ''}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Historial de atenciones */}
      <div className="card">
        <h3 className="card-title">Historial de atenciones</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Motivo de consulta</th>
                <th>Diagnóstico (CIE-10)</th>
                <th>Profesional</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {atencionesHC.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No hay atenciones registradas
                  </td>
                </tr>
              ) : (
                atencionesHC.map(a => (
                  <tr key={a.atencion_id}>
                    <td>{formatDate(a.fecha_hora)}</td>
                    <td>{a.motivo_consulta}</td>
                    <td>
                      {a.diagnostico_cie10} {a.diagnostico_nombre}
                    </td>
                    <td>{a.profesional}</td>
                    <td>
                      <span className={`badge ${getEstadoBadgeClass(a.estado)}`}>
                        {getEstadoDisplay(a.estado)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
