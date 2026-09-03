import axios from 'axios'

export const API_URL = 'http://localhost:3000'

export const TOKEN_KEY = 'littleville_token'
export const USER_KEY = 'littleville_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setSession(token, usuario) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(usuario))
}

export function getUsuario() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function limparSessao() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAutenticado() {
  return Boolean(getToken())
}

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function extrairErro(err) {
  const data = err?.response?.data
  if (data && typeof data === 'object' && data.erro) {
    return data.erro
  }
  if (err?.message) {
    return err.message
  }
  return 'Erro inesperado ao conectar com o servidor.'
}

export default api
