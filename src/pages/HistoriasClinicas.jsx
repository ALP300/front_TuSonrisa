import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { pacientes, historiasClinicas, formatDate } from '../data/mockData'

export default function HistoriasClinicas() {
  const [busqueda, setBusqueda] = useState('')

  const lista = useMemo(() => {
    const q = busqueda.toLowerCase()
    return historiasClinicas
      .map(hc => {
        const pac = pacientes.find(p => p.paciente_id === hc.paciente_id)
        return { ...hc, paciente: pac }
      })
      .filter(item => {
        if (!q) return true
        const pac = item.paciente
        return (
          pac?.nombres.toLowerCase().includes(q) ||
          pac?.apellidos.toLowerCase().includes(q) ||
          pac?.numero_documento.includes(q) ||
          item.numero?.toLowerCase().includes(q)
        )
      })
  }, [busqueda])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Historias clínicas</h1>
          <p>{historiasClinicas.length} historias registradas</p>
        </div>
      </div>

      <div className="card mb-3">
        <div className="search-group" style={{ maxWidth: '400px' }}>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', color: '#9ca3af' }}>
            <FiSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre, documento o N° HC..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ border: 'none', boxShadow: 'none' }}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>HC N°</th>
                <th>Paciente</th>
                <th>Documento</th>
                <th>Grupo sanguíneo</th>
                <th>Fecha creación</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No se encontraron historias clínicas
                  </td>
                </tr>
              ) : (
                lista.map(item => (
                  <tr key={item.historia_clinica_id}>
                    <td><strong>{item.numero}</strong></td>
                    <td>
                      {item.paciente?.nombres} {item.paciente?.apellidos}
                    </td>
                    <td>
                      <span className="text-muted text-sm">{item.paciente?.tipo_documento}</span>{' '}
                      {item.paciente?.numero_documento}
                    </td>
                    <td>{item.grupo_sanguineo || '—'}</td>
                    <td>{formatDate(item.fecha_creacion)}</td>
                    <td>
                      <Link to={`/historias-clinicas/${item.paciente_id}`} className="btn-link">
                        Ver historia
                      </Link>
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
