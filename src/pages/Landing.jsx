import { Link } from 'react-router-dom'
import GlobeBackdrop from '../components/GlobeBackdrop.jsx'
import './Landing.css'

function Landing() {
  return (
    <div className="landing">
      <GlobeBackdrop />

      <nav className="landing-nav anim-up">
        <span className="landing-logo">
          <i className="fa-solid fa-mountain-sun logo-icon" /> Little
          <span className="logo-accent">Ville</span>
        </span>
        <div className="landing-links">
          <a href="#home">Início</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
          <Link to="/login" className="nav-login">
            Entrar
          </Link>
        </div>
      </nav>

      <section id="home" className="landing-hero">
        <span className="hero-badge anim-up" style={{ animationDelay: '0.1s' }}>
          <i className="fa-solid fa-bolt hero-star" /> Little Ville — Registro de Avistamentos
        </span>
        <h1 className="anim-up" style={{ animationDelay: '0.2s' }}>
          Desvende os mistérios de{' '}
          <span className="gradient-text">Little Ville</span>
        </h1>
        <p className="anim-up" style={{ animationDelay: '0.3s' }}>
          Registre, acompanhe e compartilhe os avistamentos misteriosos de
          nossa pequena cidade tecnológica.
        </p>
        <div className="landing-actions anim-up" style={{ animationDelay: '0.4s' }}>
          <Link to="/cadastro" className="btn-primary btn-glow">
            Criar conta
          </Link>
          <Link to="/login" className="btn-secondary">
            Entrar
          </Link>
        </div>
        <div className="hero-stats anim-up" style={{ animationDelay: '0.5s' }}>
          <div className="hero-stat">
            <strong>+100</strong>
            <span>Moradores</span>
          </div>
          <div className="hero-stat">
            <strong>+30</strong>
            <span>Avistamentos</span>
          </div>
          <div className="hero-stat">
            <strong>+15</strong>
            <span>Criaturas</span>
          </div>
        </div>
      </section>

      <section id="sobre" className="landing-features">
        <div className="feature-card anim-up">
          <div className="feature-icon">
            <i className="fa-solid fa-clipboard-list" />
          </div>
          <h3>Registros inteligentes</h3>
          <p>
            Registre e organize seus avistamentos de forma rápida e intuitiva.
          </p>
        </div>
        <div className="feature-card anim-up" style={{ animationDelay: '0.1s' }}>
          <div className="feature-icon">
            <i className="fa-solid fa-chart-line" />
          </div>
          <h3>Dashboard analítico</h3>
          <p>
            Visualize seus dados com gráficos e estatísticas em tempo real.
          </p>
        </div>
        <div className="feature-card anim-up" style={{ animationDelay: '0.2s' }}>
          <div className="feature-icon">
            <i className="fa-solid fa-shield-halved" />
          </div>
          <h3>Segurança total</h3>
          <p>Acesso controlado e autenticado para moradores registrados.</p>
        </div>
      </section>

      <footer id="contato" className="landing-footer">
        <p>
          © 2026 LittleVille. Construído com <span className="logo-accent">React + Vite</span>.
        </p>
      </footer>
    </div>
  )
}

export default Landing
