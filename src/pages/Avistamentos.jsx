import { useEffect, useState } from 'react'
import Layout from './Layout.jsx'
import api, { extrairErro } from '../api.js'
import '../App.css'

function formatarData(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

function Avistamentos() {
  const [avistamentos, setAvistamentos] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [modal, setModal] = useState(false)
  const [modalExcluir, setModalExcluir] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [recarga, setRecarga] = useState(0)
  const [form, setForm] = useState({
    id: null,
    titulo: '',
    criatura: '',
    localizacao: '',
    descricao: '',
    data: '',
    confianca: 50,
  })

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
  }, [recarga])

  const abrirCriar = () => {
    setForm({
      id: null,
      titulo: '',
      criatura: '',
      localizacao: '',
      descricao: '',
      data: '',
      confianca: 50,
    })
    setModal(true)
  }

  const abrirEditar = (a) => {
    setForm({
      id: a.id,
      titulo: a.titulo || '',
      criatura: a.criatura || '',
      localizacao: a.localizacao || '',
      descricao: a.descricao || '',
      data: formatarData(a.data),
      confianca: a.confianca ?? 50,
    })
    setModal(true)
  }

  const salvar = async (e) => {
    e.preventDefault()
    setSalvando(true)
    setErro('')
    try {
      const body = {
        titulo: form.titulo,
        criatura: form.criatura,
        localizacao: form.localizacao,
        descricao: form.descricao,
        data: form.data,
        confianca: Number(form.confianca),
      }
      if (form.id) {
        await api.put(`/av/${form.id}`, body)
      } else {
        await api.post('/av', body)
      }
      setModal(false)
      setRecarga((r) => r + 1)
    } catch (err) {
      setErro(extrairErro(err))
    } finally {
      setSalvando(false)
    }
  }

  const excluir = async () => {
    setSalvando(true)
    setErro('')
    try {
      await api.delete(`/av/${modalExcluir}`)
      setModalExcluir(null)
      setRecarga((r) => r + 1)
    } catch (err) {
      setErro(extrairErro(err))
      setModalExcluir(null)
    } finally {
      setSalvando(false)
    }
  }

  const filtrados = avistamentos.filter(
    (a) =>
      (a.titulo || '').toLowerCase().includes(busca.toLowerCase()) ||
      (a.criatura || '').toLowerCase().includes(busca.toLowerCase()) ||
      (a.localizacao || '').toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <Layout>
      <h1 className="page-title anim-up">Avistamentos</h1>
      <p className="page-subtitle anim-up" style={{ animationDelay: '0.05s' }}>
        Registre e gerencie os avistamentos
      </p>

      {erro && <div className="form-error anim-in">{erro}</div>}

      <div className="crud-toolbar anim-up" style={{ animationDelay: '0.1s' }}>
        <div className="crud-search">
          <input
            type="text"
            placeholder="Buscar por título, criatura ou local..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-accent" onClick={abrirCriar}>
          + Novo avistamento
        </button>
      </div>

      <div className="table-wrap">
        {carregando ? (
          <div className="loading anim-in">
            <div className="spinner" /> Carregando...
          </div>
        ) : filtrados.length === 0 ? (
          <div className="empty-state">Nenhum avistamento encontrado.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Criatura</th>
                <th>Localização</th>
                <th>Data</th>
                <th>Confiança</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((a, i) => (
                <tr
                  key={a.id}
                  className="anim-up"
                  style={{ animationDelay: `${0.1 + i * 0.04}s` }}
                >
                  <td>{a.titulo}</td>
                  <td>{a.criatura}</td>
                  <td>{a.localizacao}</td>
                  <td>{formatarData(a.data)}</td>
                  <td>
                    <div className="confidence">
                      <span>{a.confianca}%</span>
                      <div className="confidence-bar">
                        <div
                          className="confidence-fill"
                          style={{ width: `${a.confianca}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="icon-btn icon-btn-edit"
                        onClick={() => abrirEditar(a)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn-del"
                        onClick={() => setModalExcluir(a.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{form.id ? 'Editar avistamento' : 'Novo avistamento'}</h2>
            {erro && <div className="form-error">{erro}</div>}
            <form className="form" onSubmit={salvar}>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ex: Avistamento noturno no lago"
                  required
                />
              </div>
              <div className="form-group">
                <label>Criatura</label>
                <input
                  type="text"
                  value={form.criatura}
                  onChange={(e) =>
                    setForm({ ...form, criatura: e.target.value })
                  }
                  placeholder="Ex: Pé Grande"
                  required
                />
              </div>
              <div className="form-group">
                <label>Localização</label>
                <input
                  type="text"
                  value={form.localizacao}
                  onChange={(e) =>
                    setForm({ ...form, localizacao: e.target.value })
                  }
                  placeholder="Ex: Floresta Norte"
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  placeholder="Descreva o que foi visto..."
                />
              </div>
              <div className="form-group">
                <label>Data</label>
                <input
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm({ ...form, data: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confiança: {form.confianca}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.confianca}
                  onChange={(e) =>
                    setForm({ ...form, confianca: e.target.value })
                  }
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-accent"
                  disabled={salvando}
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalExcluir !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Excluir avistamento</h2>
            <p>Tem certeza que deseja excluir este avistamento?</p>
            {erro && <div className="form-error">{erro}</div>}
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setModalExcluir(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={excluir}
                disabled={salvando}
              >
                {salvando ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Avistamentos
