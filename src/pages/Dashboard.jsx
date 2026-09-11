import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from './Layout.jsx'
import api, { extrairErro } from '../api.js'
import AvistamentosMap from '../components/AvistamentosMap.jsx'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import '../App.css'

function formatarData(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR')
}

function Dashboard() {
  const [avistamentos, setAvistamentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    async function carregar() {
      try {
        const { data } = await api.get('/av')
        if (ativo) setAvistamentos(data)
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

  const totalAvistamentos = avistamentos.length

  const criaturasMap = {}
  avistamentos.forEach((a) => {
    const nome = a.criatura || 'Indefinida'
    criaturasMap[nome] = (criaturasMap[nome] || 0) + 1
  })

  const dadosCriaturas = Object.entries(criaturasMap).map(([nome, valor]) => ({
    nome,
    avistamentos: valor,
  }))

  const criaturasDistintas = dadosCriaturas.length

  const recentes = avistamentos.slice(0, 5)

  const localizacaoMap = {}
  avistamentos.forEach((a) => {
    const local = a.localizacao || 'Indefinido'
    localizacaoMap[local] = (localizacaoMap[local] || 0) + 1
  })
  const localMaisCitado = Object.entries(localizacaoMap).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0]

  const confiancaMedia =
    totalAvistamentos === 0
      ? null
      : Math.round(
          avistamentos.reduce((soma, a) => soma + (a.confianca || 0), 0) /
            totalAvistamentos
        )

  const comLocalizacaoReal = avistamentos.filter(
    (a) => typeof a.latitude === 'number' && typeof a.longitude === 'number'
  )

  return (
    <Layout>
      <h1 className="page-title anim-up">Dashboard</h1>
      <p className="page-subtitle anim-up" style={{ animationDelay: '0.05s' }}>
        Visão geral da atividade de Little Ville
      </p>

      {carregando ? (
        <div className="loading anim-in">
          <div className="spinner" /> Carregando...
        </div>
      ) : erro ? (
        <div className="form-error anim-in">{erro}</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card anim-up" style={{ animationDelay: '0.05s' }}>
              <div className="stat-label">Total de avistamentos</div>
              <div className="stat-value">{totalAvistamentos}</div>
            </div>
            <div className="stat-card anim-up" style={{ animationDelay: '0.12s' }}>
              <div className="stat-label">Criaturas distintas</div>
              <div className="stat-value">{criaturasDistintas}</div>
            </div>
            <div className="stat-card anim-up" style={{ animationDelay: '0.19s' }}>
              <div className="stat-label">Local mais citado</div>
              <div className="stat-value" style={{ fontSize: localMaisCitado ? '1.4rem' : undefined }}>
                {localMaisCitado || '-'}
              </div>
            </div>
            <div className="stat-card anim-up" style={{ animationDelay: '0.26s' }}>
              <div className="stat-label">Confiança média</div>
              <div className="stat-value">
                {confiancaMedia === null ? '-' : `${confiancaMedia}%`}
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card anim-up" style={{ animationDelay: '0.15s' }}>
              <h3>Avistamentos por criatura</h3>
              <div className="chart-wrap">
                {dadosCriaturas.length === 0 ? (
                  <p className="empty-state">Sem dados para exibir.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosCriaturas}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis dataKey="nome" stroke="var(--muted)" />
                      <YAxis allowDecimals={false} stroke="var(--muted)" />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: 10,
                        }}
                      />
                      <Bar
                        dataKey="avistamentos"
                        fill="var(--accent)"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="card anim-up" style={{ animationDelay: '0.22s' }}>
              <h3>Avistamentos recentes</h3>
              {recentes.length === 0 ? (
                <p className="empty-state">
                  Nenhum avistamento registrado ainda.
                </p>
              ) : (
                <ul className="recent-list">
                  {recentes.map((r, i) => (
                    <li key={r.id} className="anim-up" style={{ animationDelay: `${0.25 + i * 0.06}s` }}>
                      <div>
                        <div className="recent-title">{r.titulo}</div>
                        <div className="recent-meta">
                          {r.criatura} · {r.localizacao}
                        </div>
                      </div>
                      <span className="recent-date">
                        {formatarData(r.data)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="card anim-up" style={{ animationDelay: '0.3s', marginTop: 20 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <h3 style={{ margin: 0 }}>Localizações reais no mapa</h3>
              <Link to="/mapa" className="btn-link">
                Ver mapa completo
              </Link>
            </div>
            <AvistamentosMap avistamentos={comLocalizacaoReal} altura={320} zoom={11} />
          </div>
        </>
      )}
    </Layout>
  )
}

export default Dashboard
