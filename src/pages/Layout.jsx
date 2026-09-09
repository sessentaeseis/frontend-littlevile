import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { getUsuario, isAutenticado, limparSessao } from '../api.js'
import '../App.css'

function Layout({ children }) {
  const navigate = useNavigate()

  if (!isAutenticado()) {
    return <Navigate to="/login" replace />
  }

  const usuario = getUsuario()

  const sair = () => {
    limparSessao()
    navigate('/login')
  }

  return (
    <div className="page">
      <header className="topbar">
        <Link to="/dashboard" className="topbar-brand">
          <i className="fa-solid fa-mountain-sun logo-icon" /> Littlevile
        </Link>
        <nav className="topbar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/avistamentos"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Avistamentos
          </NavLink>
        </nav>
        <div className="topbar-user">
          {usuario?.nome && <span className="topbar-nome">{usuario.nome}</span>}
          <button type="button" className="btn-link" onClick={sair}>
            Sair
          </button>
        </div>
      </header>

      <main className="page-content">{children}</main>
    </div>
  )
}

export default Layout
