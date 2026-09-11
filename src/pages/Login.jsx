import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import api, { extrairErro, setSession, isAutenticado } from '../api.js'
import '../App.css'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  if (isAutenticado()) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (!email || !senha) {
      setErro('Preencha todos os campos.')
      return
    }

    setCarregando(true)
    try {
      const { data } = await api.post('/auth/login', { email, senha })
      setSession(data.token, data.usuario)
      navigate('/dashboard')
    } catch (err) {
      setErro(extrairErro(err))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <h1>Entrar</h1>
        <p className="page-subtitle">Acesse sua conta de morador</p>

        {erro && <div className="form-error">{erro}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-accent btn-block"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-switch">
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
