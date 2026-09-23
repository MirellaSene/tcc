import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  CheckCircle,
  Clock,
  Shield,
  Smartphone,
  ArrowLeft,
  PackageCheck,
} from 'lucide-react';

import '../styles/orderTracking.css';

interface TrackingData {
  planName?: string;
  price?: string;
  period?: string;
  receiptNumber?: string;
}

const OrderTracking: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const data =
    (location.state as TrackingData) || {};

  const planName =
    data.planName || 'Anual';

  const price =
    data.price || 'R$ 499,00';

  const receiptNumber =
    data.receiptNumber || 'ZL-00000000';

  return (

    <div className="tracking-page">


      <header className="tracking-header">

        <div className="tracking-header-content">

          <span
            className="tracking-logo"
            onClick={() => navigate('/')}
          >
            ZELOOS
          </span>


          <button
            className="tracking-back"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} />

            Voltar
          </button>

        </div>

      </header>



      <main className="tracking-container">


        <div className="tracking-top">

          <div>

            <span className="tracking-label">
              ASSINATURA
            </span>

            <h1>
              Acompanhe sua assinatura
            </h1>

            <p>
              Nº {receiptNumber}
            </p>

          </div>


          <div className="tracking-status-badge">

            <Clock size={17} />

            Em ativação

          </div>

        </div>



        <section className="tracking-card">

          {/* PRODUTO */}

          <div className="tracking-card-header">

            <div className="tracking-product">

              <div className="tracking-product-icon">

                <Smartphone size={27} />

              </div>


              <div>

                <strong>
                  ZELOOS {planName}
                </strong>

                <span>
                  Assinatura digital
                </span>

              </div>

            </div>


            <strong className="tracking-price">
              {price}
            </strong>

          </div>



          <div className="tracking-timeline">

            {/* 1 */}

            <div className="timeline-item completed">

              <div className="timeline-icon">

                <CheckCircle size={20} />

              </div>


              <div className="timeline-content">

                <strong>
                  Pagamento aprovado
                </strong>

                <span>
                  Seu pagamento foi confirmado.
                </span>

              </div>

            </div>


            <div className="timeline-item completed">

              <div className="timeline-icon">

                <CheckCircle size={20} />

              </div>


              <div className="timeline-content">

                <strong>
                  Assinatura confirmada
                </strong>

                <span>
                  Seu plano {planName} foi registrado.
                </span>

              </div>

            </div>


            <div className="timeline-item current">

              <div className="timeline-icon">

                <Clock size={20} />

              </div>


              <div className="timeline-content">

                <strong>
                  Ativando proteção
                </strong>

                <span>
                  Estamos preparando sua conta ZELOOS.
                </span>

              </div>

            </div>


            <div className="timeline-item">

              <div className="timeline-icon">

                <PackageCheck size={20} />

              </div>


              <div className="timeline-content">

                <strong>
                  ZELOOS pronto para uso
                </strong>

                <span>
                  Sua proteção estará disponível.
                </span>

              </div>

            </div>

          </div>

          <div className="tracking-current-status">

            <div className="current-status-icon">

              <Shield size={25} />

            </div>


            <div>

              <strong>
                Ativando sua assinatura...
              </strong>

              <p>
                Estamos preparando os recursos
                de proteção do seu plano.
              </p>

            </div>

          </div>

        </section>
        <section className="tracking-info-grid">

          <div className="tracking-info-card">

            <span>
              Plano
            </span>

            <strong>
              {planName}
            </strong>

          </div>


          <div className="tracking-info-card">

            <span>
              Valor
            </span>

            <strong>
              {price}
            </strong>

          </div>


          <div className="tracking-info-card">

            <span>
              Status
            </span>

            <strong className="green-text">
              Em ativação
            </strong>

          </div>

        </section>

        <button
          className="tracking-home-btn"
          onClick={() => navigate('/')}
        >
          Ir para o ZELOOS
        </button>

      </main>

    </div>

  );
};

export default OrderTracking;