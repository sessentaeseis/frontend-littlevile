import { useEffect, useMemo, useState } from 'react'
import Layout from './Layout.jsx'
import api, { extrairErro } from '../api.js'
import AvistamentosMap from '../components/AvistamentosMap.jsx'
import '../App.css'

function Mapa() {
  const [avistamentos, setAvistamentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [filtroCriatura, setFiltroCriatura] = useState('todas')

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

  const criaturas = useMemo(() => {
    const set = new Set(avistamentos.map((a) => a.criatura).filter(Boolean))
    return Array.from(set).sort()
  }, [avistamentos])

  const comCoordenadas = avistamentos.filter(
    (a) => typeof a.latitude === 'number' && typeof a.longitude === 'number'
  )

  const filtrados =
    filtroCriatura === 'todas'
      ? comCoordenadas
      : comCoordenadas.filter((a) => a.criatura === filtroCriatura)

  return (
    <Layout>
      <h1 className="page-title anim-up">Mapa de avistamentos</h1>
      <p className="page-subtitle anim-up" style={{ animationDelay: '0.05s' }}>
        Localização real de {comCoordenadas.length} avistamento(s) registrados
      </p>

      {erro && <div className="form-error anim-in">{erro}</div>}

      {!carregando && criaturas.length > 0 && (
        <div className="crud-toolbar anim-up" style={{ animationDelay: '0.1s' }}>
          <div className="form-group" style={{ margin: 0, minWidth: 220 }}>
            <select
              value={filtroCriatura}
              onChange={(e) => setFiltroCriatura(e.target.value)}
            >
              <option value="todas">Todas as criaturas</option>
              {criaturas.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="card anim-up" style={{ animationDelay: '0.15s', padding: 0 }}>
        {carregando ? (
          <div className="loading anim-in" style={{ padding: 24 }}>
            <div className="spinner" /> Carregando...
          </div>
        ) : (
          <AvistamentosMap avistamentos={filtrados} altura={560} zoom={11} />
        )}
      </div>
    </Layout>
  )
}

export default Mapa
