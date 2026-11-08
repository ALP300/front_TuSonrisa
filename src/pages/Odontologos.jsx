import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { odontologos, getEstadoBadgeClass } from '../data/mockData'

export default function Odontologos() {
  const [busqueda, setBusqueda] = useState('')

  const lista = useMemo(() => {
    const q = busqueda.toLowerCase()
    return odontologos.filter(o =>
      !q ||
      o.nombres.toLowerCase().includes(q) ||
      o.apellidos.toLowerCase().includes(q) ||
      (o.numero_colegiatura && o.numero_colegiatura.toLowerCase().includes(q))
    )
  }, [busqueda])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Odontólogos</h1>
          <p>{odontologos.length} profesionales registrados</p>
        </div>
        <Link to="/odontologos/nuevo" className="btn btn-primary">
          <FiPlus /> Nuevo odontólogo
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
            placeholder="Buscar por nombre o colegiatura..."
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
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Colegiatura</th>
                <th>Especialidad</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No se encontraron odontólogos
                  </td>
                </tr>
              ) : (
                lista.map(o => (
                  <tr key={o.odontologo_id}>
                    <td>{o.nombres}</td>
                    <td>{o.apellidos}</td>
                    <td><strong>{o.numero_colegiatura || '—'}</strong></td>
                    <td>{o.especialidad || '—'}</td>
                    <td>{o.telefono || '—'}</td>
                    <td>{o.correo || '—'}</td>
                    <td>
                      <span className={`badge ${getEstadoBadgeClass(o.estado)}`}>{o.estado}</span>
                    </td>
                    <td>
                      <Link to={`/odontologos/editar/${o.odontologo_id}`} className="btn-link">
                        Editar
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
