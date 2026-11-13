import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  User,
  MapPin,
  Bell,
  FileText,
  CircleHelp,
  Database,
  LogOut,
  ChevronRight,
} from 'lucide-react';

import '../styles/settings.css';
import { clearSession } from '../services/api';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-page">

      {/* =========================
          TOPO
      ========================= */}

      <header className="settings-header">

        <button
          className="settings-back"
          onClick={() => navigate('/')}
          aria-label="Voltar"
        >
          <ArrowLeft size={27} />
        </button>

        <h1>Configurações</h1>

        <div className="settings-header-space" />

      </header>


      <main className="settings-container">

        {/* =========================
            GERENCIAR
        ========================= */}

        <section className="settings-section">

          <h2>Gerenciar</h2>

          <div className="settings-card">

            <button
              className="settings-item"
              onClick={() => navigate('/conta')}
            >

              <div className="settings-item-left">

                <User size={23} />

                <span>
                  Conta
                </span>

              </div>

              <ChevronRight
                size={20}
                className="settings-chevron"
              />

            </button>

          </div>

        </section>


        {/* =========================
            PERMISSÃO
        ========================= */}

        <section className="settings-section">

          <h2>Permissão</h2>

          <div className="settings-card">

            <button className="settings-item">

              <div className="settings-item-left">

                <MapPin size={23} />

                <span>
                  Localização
                </span>

              </div>

              <ChevronRight
                size={20}
                className="settings-chevron"
              />

            </button>


            <div className="settings-divider" />


            <button className="settings-item">

              <div className="settings-item-left">

                <Bell size={23} />

                <span>
                  Notificações
                </span>

              </div>

              <ChevronRight
                size={20}
                className="settings-chevron"
              />

            </button>

          </div>

        </section>


        {/* =========================
            PRIVACIDADE
        ========================= */}

        <section className="settings-section">

          <h2>Privacidade</h2>

          <div className="settings-card">

            <button className="settings-item">

              <div className="settings-item-left">

                <FileText size={23} />

                <span>
                  Excluir conta
                </span>

              </div>

              <ChevronRight
                size={20}
                className="settings-chevron"
              />

            </button>

          </div>

        </section>


        {/* =========================
            AJUDA
        ========================= */}

        <section className="settings-section">

          <h2>Ajuda</h2>

          <div className="settings-card">

            <button className="settings-item">

              <div className="settings-item-left">

                <CircleHelp size={23} />

                <span>
                  Central de Ajuda
                </span>

              </div>

              <ChevronRight
                size={20}
                className="settings-chevron"
              />

            </button>


            <div className="settings-divider" />


            <button className="settings-item">

              <div className="settings-item-left">

                <Database size={23} />

                <span>
                  Informações do dispositivo
                </span>

              </div>

              <ChevronRight
                size={20}
                className="settings-chevron"
              />

            </button>

          </div>

        </section>


        {/* =========================
            VERSÃO
        ========================= */}

        <div className="settings-version">

          Versão do aplicativo 10.68.2 - 21445

        </div>


        {/* =========================
            SAIR
        ========================= */}

        <button
          className="settings-logout"
          onClick={() => {
            clearSession();
            navigate('/login');
          }}
        >

          <LogOut size={20} />

          Sair

        </button>

      </main>

    </div>
  );
};

export default Settings;