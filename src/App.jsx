import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Avistamentos from './pages/Avistamentos.jsx'
import Mapa from './pages/Mapa.jsx'
import Perfil from './pages/Perfil.jsx'
import Landing from './pages/Landing.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/avistamentos" element={<Avistamentos />} />
      <Route path="/mapa" element={<Mapa />} />
      <Route path="/perfil" element={<Perfil />} />
    </Routes>
  )
}

export default App
