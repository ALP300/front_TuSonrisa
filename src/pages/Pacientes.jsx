import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { pacientes, getEstadoBadgeClass } from '../data/mockData'

export default function Pacientes() {
  const [busqueda, setBusqueda] = useState('')

  const pacientesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase()
    return pacientes.filter(p =>
      !q ||
      p.nombres.toLowerCase().includes(q) ||
      p.apellidos.toLowerCase().includes(q) ||
      p.numero_documento.includes(q)
    )
  }, [busqueda])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Pacientes</h1>
          <p>{pacientes.length} pacientes registrados</p>
        </div>
        <Link to="/pacientes/nuevo" className="btn btn-primary">
          <FiPlus /> Nuevo paciente
        </Link>
      </div>

      <div className="card mb-3">
        <div className="search-group" style={{ maxWidth: '400px' }}>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', color: '#9ca3af' }}>
            <FiSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o documento..."
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
                <th>Documento</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No se encontraron pacientes
                  </td>
                </tr>
              ) : (
                pacientesFiltrados.map(p => (
                  <tr key={p.paciente_id}>
                    <td>
                      <span className="text-muted text-sm">{p.tipo_documento}</span>{' '}
                      <strong>{p.numero_documento}</strong>
                    </td>
                    <td>{p.nombres}</td>
                    <td>{p.apellidos}</td>
                    <td>{p.telefono || '—'}</td>
                    <td>{p.correo || '—'}</td>
                    <td>
                      <span className={`badge ${getEstadoBadgeClass(p.estado)}`}>{p.estado}</span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <Link to={`/pacientes/editar/${p.paciente_id}`} className="btn-link">
                          Editar
                        </Link>
                        <span className="text-muted">·</span>
                        <Link to={`/historias-clinicas/${p.paciente_id}`} className="btn-link">
                          HC
                        </Link>
                      </div>
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
