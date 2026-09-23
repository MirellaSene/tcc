import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Bell,
  History,
  Shield,
  Smartphone,
  Zap,
  Clock,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

import '../styles/home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: MapPin,
      title: 'Rastreamento em Tempo Real',
      description: 'Monitore a localização exata a qualquer momento.'
    },
    {
      icon: Bell,
      title: 'Alertas Inteligentes',
      description: 'Receba notificações sobre eventos importantes.'
    },
    {
      icon: History,
      title: 'Histórico de Rotas',
      description: 'Acesse o trajeto realizado nos últimos 30 dias.'
    },
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Proteção e segurança para os seus dados.'
    },
    {
      icon: Smartphone,
      title: 'Aplicativo Multiplataforma',
      description: 'Acesse pelo celular, tablet ou computador.'
    },
    {
      icon: Zap,
      title: 'Atualização Instantânea',
      description: 'Informações sincronizadas em tempo real.'
    }
  ];

  return (
    <div className="app">

      <header className="header">
        <div className="header-content">

          <span
            className="logo"
            onClick={() => navigate('/')}
          >
            ZELOOS
          </span>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

          <nav
            className={`nav-buttons ${
              mobileMenuOpen ? 'mobile-open' : ''
            }`}
          >
            <Link
              to="/login"
              className="acessar"
              onClick={() => setMobileMenuOpen(false)}
            >
              Acessar
            </Link>

            <button
              className="comecar"
              onClick={() => navigate('/signup')}
            >
              Começar
            </button>
          </nav>

        </div>

        <div className="header-line"></div>
      </header>


      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="container">

          <div className="main-content">

            <div className="left-side">

              <div className="hero-text">

                <span className="badge">
                  <MapPin size={14} />
                  SOLUÇÃO EM LOCALIZAÇÃO
                </span>

                <h1 className="title">

                  <span className="title-black">
                    LOCALIZAÇÃO EM
                  </span>

                  <br />

                  <span className="title-gradient">
                    TEMPO REAL
                  </span>

                </h1>

                <p className="description">
                  Plataforma profissional de rastreamento para famílias
                  com tecnologia avançada, com foco em segurança e
                  eficiência.
                </p>


                <div className="buttons">

                  <button
                    className="btn-primary"
                    onClick={() => navigate('/signup')}
                  >
                    Comprar agora

                    <ArrowRight size={18} />
                  </button>

                  <button className="btn-secondary">
                    Ver especificações
                  </button>

                </div>


                {/* ================= ESTATÍSTICAS ================= */}

                <div className="stats">

                  <div className="stat-item">
                    <span className="stat-number">
                      50K+
                    </span>

                    <span className="stat-label">
                      USUÁRIOS ATIVOS
                    </span>
                  </div>


                  <div className="stat-item">
                    <span className="stat-number">
                      99.9%
                    </span>

                    <span className="stat-label">
                      UPTIME
                    </span>
                  </div>


                  <div className="stat-item">
                    <span className="stat-number">
                      150+
                    </span>

                    <span className="stat-label">
                      PAÍSES
                    </span>
                  </div>

                </div>

              </div>

            </div>


            {/* ================= RELÓGIO ================= */}

            <div className="right-side">

              <div className="image-wrapper">

                <div className="clock-background"></div>

                <div className="clock-ring"></div>

                <div className="clock-ring-2"></div>

                <Clock
                  size={130}
                  className="clock-icon"
                />

                <div className="clock-dot"></div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FUNCIONALIDADES ================= */}

      <section className="features-section">

        <div className="container-features">

          <h2 className="features-title">
            FUNCIONALIDADES
          </h2>

          <p className="features-description">
            Tecnologia de ponta para rastreamento preciso e confiável
          </p>


          <div className="cards-grid">

            {features.map((feature, index) => {

              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="feature-card"
                >

                  <div className="card-icon-wrapper">
                    <Icon size={28} />
                  </div>

                  <h3>
                    {feature.title}
                  </h3>

                  <p>
                    {feature.description}
                  </p>

                </div>
              );

            })}

          </div>

          <div className="features-line"></div>

        </div>

      </section>



      <section className="cta-section">

        <div className="container-cta">

          <h2 className="cta-title">
            PRONTO PARA COMEÇAR?
          </h2>

          <p className="cta-description">
            Adquira sua pulseira e tenha tranquilidade
          </p>

          <button
            className="cta-button"
            onClick={() => navigate('/signup')}
          >
            COMPRAR AGORA

            <ArrowRight size={18} />
          </button>

        </div>

      </section>



      <footer className="footer">

        <div className="container-footer">

          <div className="footer-content">

            <div className="footer-logo">

              <span className="logo-footer">
                ZELOOS
              </span>

              <p className="footer-tagline">
                Segurança e confiança em tempo real
              </p>

            </div>


            <div className="footer-links">

              <div className="footer-column">

                <h4>Empresa</h4>

                <Link to="#">
                  Sobre nós
                </Link>

                <Link to="#">
                  Carreiras
                </Link>

                <Link to="#">
                  Blog
                </Link>

              </div>


              <div className="footer-column">

                <h4>Produto</h4>

                <Link to="#">
                  Funcionalidades
                </Link>

                <Link to="#">
                  Preços
                </Link>

                <Link to="#">
                  Depoimentos
                </Link>

              </div>


              <div className="footer-column">

                <h4>Suporte</h4>

                <Link to="#">
                  Central de ajuda
                </Link>

                <Link to="#">
                  Contato
                </Link>

                <Link to="#">
                  Privacidade
                </Link>

              </div>


              <div className="footer-column">

                <h4>Redes Sociais</h4>

                <Link to="#">
                  Instagram
                </Link>

                <Link to="#">
                  LinkedIn
                </Link>

                <Link to="#">
                  Twitter
                </Link>

              </div>

            </div>

          </div>


          <div className="footer-bottom">

            <div className="footer-line"></div>

            <p className="copyright">
              © 2024 ZELOOS. Todos os direitos reservados.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default Home;