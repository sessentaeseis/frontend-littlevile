import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { extrairErro } from '../api.js'
import '../App.css'

function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    if (!nome || !email || !senha) {
      setErro('Preencha todos os campos.')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)
    try {
      await api.post('/auth/register', { nome, email, senha })
      navigate('/login')
    } catch (err) {
      setErro(extrairErro(err))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <h1>Criar conta</h1>
        <p className="page-subtitle">Cadastre-se como morador de Little Ville</p>

        {erro && <div className="form-error">{erro}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmar-senha">Confirmar senha</label>
            <input
              id="confirmar-senha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-accent btn-block"
            disabled={carregando}
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="auth-switch">
          Já tem conta? <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  )
}

export default Cadastro
