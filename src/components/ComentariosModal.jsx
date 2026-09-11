import { useEffect, useState } from 'react'
import api, { extrairErro, getUsuario } from '../api.js'

function formatarDataHora(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ComentariosModal({ avistamento, onFechar }) {
  const usuario = getUsuario()
  const [comentarios, setComentarios] = useState([])
  const [texto, setTexto] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    async function carregar() {
      setCarregando(true)
      try {
        const { data } = await api.get(`/av/${avistamento.id}/comentarios`)
        if (ativo) setComentarios(data)
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
  }, [avistamento.id])

  const enviar = async (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    setEnviando(true)
    setErro('')
    try {
      const { data } = await api.post(`/av/${avistamento.id}/comentarios`, {
        texto: texto.trim(),
      })
      setComentarios((atual) => [...atual, data])
      setTexto('')
    } catch (err) {
      setErro(extrairErro(err))
    } finally {
      setEnviando(false)
    }
  }

  const excluir = async (comentarioId) => {
    setErro('')
    try {
      await api.delete(`/av/comentarios/${comentarioId}`)
      setComentarios((atual) => atual.filter((c) => c.id !== comentarioId))
    } catch (err) {
      setErro(extrairErro(err))
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal comentarios-modal">
        <h2>Comentários</h2>
        <p className="page-subtitle" style={{ margin: '0 0 12px' }}>
          {avistamento.titulo}
        </p>

        {erro && <div className="form-error">{erro}</div>}

        <div className="comentarios-lista">
          {carregando ? (
            <div className="loading anim-in">
              <div className="spinner" /> Carregando...
            </div>
          ) : comentarios.length === 0 ? (
            <p className="empty-state">
              Nenhum comentário ainda. Seja o primeiro morador a comentar!
            </p>
          ) : (
            comentarios.map((c) => (
              <div key={c.id} className="comentario-item">
                <div className="comentario-cabecalho">
                  <span className="comentario-autor">
                    {c.autor?.nome || 'Morador'}
                  </span>
                  <span className="comentario-data">
                    {formatarDataHora(c.createdAt)}
                  </span>
                </div>
                <p className="comentario-texto">{c.texto}</p>
                {usuario?.id === c.userId && (
                  <button
                    type="button"
                    className="btn-link comentario-excluir"
                    onClick={() => excluir(c.id)}
                  >
                    Excluir
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <form className="form comentario-form" onSubmit={enviar}>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva um comentário para os outros moradores..."
            rows={3}
          />
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onFechar}>
              Fechar
            </button>
            <button
              type="submit"
              className="btn btn-accent"
              disabled={enviando || !texto.trim()}
            >
              {enviando ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ComentariosModal
