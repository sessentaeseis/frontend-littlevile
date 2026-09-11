import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { getUsuario, isAutenticado, limparSessao } from '../api.js'
import '../App.css'

function iniciais(nome) {
  if (!nome) return '?'
  const partes = nome.trim().split(/\s+/)
  const letras = partes.slice(0, 2).map((p) => p[0]?.toUpperCase())
  return letras.join('') || '?'
}

function Layout({ children }) {
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function aoClicarFora(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false)
      }
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

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
          <NavLink
            to="/mapa"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Mapa
          </NavLink>
        </nav>
        <div className="topbar-user" ref={menuRef}>
          <button
            type="button"
            className="user-menu-trigger"
            onClick={() => setMenuAberto((v) => !v)}
          >
            <span className="user-avatar">{iniciais(usuario?.nome)}</span>
            {usuario?.nome && (
              <span className="topbar-nome">{usuario.nome}</span>
            )}
            <i className="fa-solid fa-chevron-down user-chevron" />
          </button>

          {menuAberto && (
            <div className="user-menu">
              <div className="user-menu-header">
                <div className="user-menu-nome">{usuario?.nome}</div>
                <div className="user-menu-email">{usuario?.email}</div>
              </div>
              <Link
                to="/perfil"
                className="user-menu-item"
                onClick={() => setMenuAberto(false)}
              >
                <i className="fa-solid fa-user" /> Meu perfil
              </Link>
              <button type="button" className="user-menu-item" onClick={sair}>
                <i className="fa-solid fa-right-from-bracket" /> Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="page-content">{children}</main>
    </div>
  )
}

export default Layout
