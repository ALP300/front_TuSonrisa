import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { pacientes, historiasClinicas } from '../data/mockData'

export default function NuevaAtencion() {
  const navigate = useNavigate()
  const { id } = useParams()
  const pacienteId = parseInt(id)
  const paciente = pacientes.find(p => p.paciente_id === pacienteId)
  const historia = historiasClinicas.find(hc => hc.paciente_id === pacienteId)

  const [form, setForm] = useState({
    // Anamnesis
    viajes: '',
    motivo_consulta: '',
    enfermedad_actual: '',
    tiempo_enfermedad: '',
    signos_sintomas: '',
    relato_cronologico: '',
    funciones_biologicas: '',
    // Examen clínico
    presion_arterial: '',
    pulso: '',
    temperatura: '',
    examen_clinico_general: '',
    examen_odontoestomatologico: '',
    // Diagnósticos
    diagnosticos: [
      { tipo: 'Presuntivo', codigo: '', descripcion: '' },
      { tipo: 'Definitivo', codigo: '', descripcion: '' },
    ],
    // Tratamiento
    tratamientos: [
      { servicio: '' },
    ],
    pronostico: '',
    // Medicación
    medicamentos: [
      { nombre: '', dosis: '', via: '', tiempo: '' },
    ],
    // Control
    control_evolucion: '',
    fecha_alta: '',
    profesional: '',
  })

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleDiagChange = (index, field, value) => {
    setForm(prev => {
      const diagnosticos = [...prev.diagnosticos]
      diagnosticos[index] = { ...diagnosticos[index], [field]: value }
      return { ...prev, diagnosticos }
    })
  }

  const addDiagnostico = () => {
    setForm(prev => ({
      ...prev,
      diagnosticos: [...prev.diagnosticos, { tipo: 'Presuntivo', codigo: '', descripcion: '' }],
    }))
  }

  const handleTratChange = (index, field, value) => {
    setForm(prev => {
      const tratamientos = [...prev.tratamientos]
      tratamientos[index] = { ...tratamientos[index], [field]: value }
      return { ...prev, tratamientos }
    })
  }

  const addTratamiento = () => {
    setForm(prev => ({
      ...prev,
      tratamientos: [...prev.tratamientos, { servicio: '' }],
    }))
  }

  const handleMedChange = (index, field, value) => {
    setForm(prev => {
      const medicamentos = [...prev.medicamentos]
      medicamentos[index] = { ...medicamentos[index], [field]: value }
      return { ...prev, medicamentos }
    })
  }

  const handleSubmit = () => {
    // TODO: enviar a API
    alert('Atención registrada (mock).')
    navigate(`/historias-clinicas/${pacienteId}`)
  }

  if (!paciente || !historia) {
    return <div className="empty-state"><p>Datos no encontrados</p></div>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Nueva atención</h1>
          <p>
            {paciente.nombres} {paciente.apellidos} · HC N° {historia.numero} · Dra. Rosa Quispe
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Anamnesis */}
          <div className="card">
            <h3 className="card-title">Anamnesis</h3>

            <div className="form-group">
              <label className="form-label">Viajes en el último año</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ninguno"
                value={form.viajes}
                onChange={e => handleChange('viajes', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Motivo de consulta</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Describa el motivo principal..."
                value={form.motivo_consulta}
                onChange={e => handleChange('motivo_consulta', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Enfermedad actual</label>
              <textarea
                className="form-control"
                rows={2}
                value={form.enfermedad_actual}
                onChange={e => handleChange('enfermedad_actual', e.target.value)}
              />
            </div>

            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label">Tiempo de enfermedad</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.tiempo_enfermedad}
                  onChange={e => handleChange('tiempo_enfermedad', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Signos y síntomas principales</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.signos_sintomas}
                  onChange={e => handleChange('signos_sintomas', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Relato cronológico</label>
              <textarea
                className="form-control"
                rows={2}
                value={form.relato_cronologico}
                onChange={e => handleChange('relato_cronologico', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Funciones biológicas</label>
              <textarea
                className="form-control"
                rows={2}
                value={form.funciones_biologicas}
                onChange={e => handleChange('funciones_biologicas', e.target.value)}
              />
            </div>
          </div>

          {/* Diagnóstico */}
          <div className="card">
            <h3 className="card-title">Diagnóstico (CIE-10)</h3>

            {form.diagnosticos.map((diag, i) => (
              <div key={i} className="mb-2">
                <label className="form-label">{diag.tipo} - código</label>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Código CIE-10"
                      value={diag.codigo}
                      onChange={e => handleDiagChange(i, 'codigo', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Descripción"
                      value={diag.descripcion}
                      onChange={e => handleDiagChange(i, 'descripcion', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="btn btn-outline btn-sm" onClick={addDiagnostico}>
              <FiPlus /> Agregar diagnóstico
            </button>
          </div>

          {/* Tratamiento / recomendaciones */}
          <div className="card">
            <h3 className="card-title">Tratamiento / recomendaciones</h3>

            {form.medicamentos.map((med, i) => (
              <div key={i} className="mb-2">
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Medicamento (nombre genérico)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={med.nombre}
                      onChange={e => handleMedChange(i, 'nombre', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dosis</label>
                    <input
                      type="text"
                      className="form-control"
                      value={med.dosis}
                      onChange={e => handleMedChange(i, 'dosis', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label className="form-label">Vía de administración</label>
                    <input
                      type="text"
                      className="form-control"
                      value={med.via}
                      onChange={e => handleMedChange(i, 'via', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tiempo de administración</label>
                    <input
                      type="text"
                      className="form-control"
                      value={med.tiempo}
                      onChange={e => handleMedChange(i, 'tiempo', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Examen clínico */}
          <div className="card">
            <h3 className="card-title">Examen clínico</h3>

            <div className="form-row form-row-3">
              <div className="form-group">
                <label className="form-label">P.A.</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="120/80"
                  value={form.presion_arterial}
                  onChange={e => handleChange('presion_arterial', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pulso</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="76"
                  value={form.pulso}
                  onChange={e => handleChange('pulso', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Temp.</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="36.5"
                  value={form.temperatura}
                  onChange={e => handleChange('temperatura', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Examen clínico general</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.examen_clinico_general}
                onChange={e => handleChange('examen_clinico_general', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Examen odontoestomatológico</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.examen_odontoestomatologico}
                onChange={e => handleChange('examen_odontoestomatologico', e.target.value)}
              />
            </div>
          </div>

          {/* Plan de tratamiento y pronóstico */}
          <div className="card">
            <h3 className="card-title">Plan de tratamiento y pronóstico</h3>

            <div className="form-group">
              <label className="form-label">Servicio</label>
              {form.tratamientos.map((trat, i) => (
                <div key={i} className="mb-1">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Endodoncia"
                    value={trat.servicio}
                    onChange={e => handleTratChange(i, 'servicio', e.target.value)}
                  />
                </div>
              ))}
            </div>

            <button type="button" className="btn btn-outline btn-sm mb-2" onClick={addTratamiento}>
              <FiPlus /> Agregar tratamiento
            </button>

            <div className="form-group">
              <label className="form-label">Pronóstico</label>
              <textarea
                className="form-control"
                rows={2}
                value={form.pronostico}
                onChange={e => handleChange('pronostico', e.target.value)}
              />
            </div>
          </div>

          {/* Control, evolución y alta */}
          <div className="card">
            <h3 className="card-title">Control, evolución y alta</h3>

            <div className="form-group">
              <label className="form-label">Control y evolución</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.control_evolucion}
                onChange={e => handleChange('control_evolucion', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de alta</label>
              <input
                type="date"
                className="form-control"
                value={form.fecha_alta}
                onChange={e => handleChange('fecha_alta', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profesional</label>
              <input
                type="text"
                className="form-control"
                value={form.profesional}
                onChange={e => handleChange('profesional', e.target.value)}
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Guardar atención
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/historias-clinicas/${pacienteId}`)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
