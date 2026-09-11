import { useEffect, useState } from 'react'
import Layout from './Layout.jsx'
import api, { extrairErro, getUsuario, setSession, getToken } from '../api.js'
import '../App.css'

function formatarDataHora(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function iniciais(nome) {
  if (!nome) return '?'
  const partes = nome.trim().split(/\s+/)
  const letras = partes.slice(0, 2).map((p) => p[0]?.toUpperCase())
  return letras.join('') || '?'
}

function Perfil() {
  const [usuario, setUsuario] = useState(getUsuario())
  const [meusAvistamentos, setMeusAvistamentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    async function carregar() {
      try {
        const [{ data: meData }, { data: avData }] = await Promise.all([
          api.get('/auth/me'),
          api.get('/av'),
        ])
        if (!ativo) return
        setUsuario(meData.usuario)
        setSession(getToken(), meData.usuario)
        setMeusAvistamentos(
          avData.filter((a) => a.userId === meData.usuario.id)
        )
      } catch (err) {
        if (ativo) setErro(extrairErro(err))
      } finally {
        if (ativo) setCarregando(false)
      }
    }
    carregar()
    return () => {
      ativo = false
    }
  }, [])

  const totalMeus = meusAvistamentos.length
  const confiancaMedia =
    totalMeus === 0
      ? 0
      : Math.round(
          meusAvistamentos.reduce((soma, a) => soma + (a.confianca || 0), 0) /
            totalMeus
        )
  const comLocalizacaoReal = meusAvistamentos.filter(
    (a) => typeof a.latitude === 'number' && typeof a.longitude === 'number'
  ).length

  return (
    <Layout>
      <h1 className="page-title anim-up">Meu perfil</h1>
      <p className="page-subtitle anim-up" style={{ animationDelay: '0.05s' }}>
        Suas informações e atividade em Little Ville
      </p>

      {erro && <div className="form-error anim-in">{erro}</div>}

      <div className="card anim-up profile-card" style={{ animationDelay: '0.1s' }}>
        <div className="profile-avatar">{iniciais(usuario?.nome)}</div>
        <div>
          <h2 style={{ margin: 0 }}>{usuario?.nome || '—'}</h2>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            {usuario?.email}
          </p>
          {usuario?.createdAt && (
            <p className="map-picker-hint" style={{ marginTop: 6 }}>
              Membro desde {formatarDataHora(usuario.createdAt)}
            </p>
          )}
        </div>
      </div>

      {carregando ? (
        <div className="loading anim-in">
          <div className="spinner" /> Carregando...
        </div>
      ) : (
        <div className="stats-grid" style={{ marginTop: 20 }}>
          <div className="stat-card anim-up" style={{ animationDelay: '0.15s' }}>
            <div className="stat-label">Meus avistamentos</div>
            <div className="stat-value">{totalMeus}</div>
          </div>
          <div className="stat-card anim-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-label">Confiança média</div>
            <div className="stat-value">
              {totalMeus === 0 ? '-' : `${confiancaMedia}%`}
            </div>
          </div>
          <div className="stat-card anim-up" style={{ animationDelay: '0.25s' }}>
            <div className="stat-label">Com localização real</div>
            <div className="stat-value">{comLocalizacaoReal}</div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Perfil
