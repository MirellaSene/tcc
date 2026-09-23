import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Shield,
  ArrowLeft,
  CheckCircle,
  Smartphone,
  Download,
  PackageCheck,
} from 'lucide-react';

import './../styles/checkout.css';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(1);

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const plans: Plan[] = [
    {
      name: 'Mensal',
      price: 'R$ 49,90',
      period: '/mês',
      features: [
        'Rastreamento em tempo real',
        'Alertas inteligentes',
        'Suporte 24/7',
      ],
    },
    {
      name: 'Anual',
      price: 'R$ 499,00',
      period: '/ano',
      features: [
        'Rastreamento em tempo real',
        'Alertas inteligentes',
        'Suporte 24/7',
        'Histórico de 60 dias',
        '10% de desconto',
      ],
    },
    {
      name: 'Família',
      price: 'R$ 799,00',
      period: '/ano',
      features: [
        'Até 5 dispositivos',
        'Rastreamento em tempo real',
        'Alertas inteligentes',
        'Suporte prioritário',
        'Histórico ilimitado',
      ],
    },
  ];

  const currentPlan = plans[selectedPlan];

  const today = new Date().toLocaleDateString('pt-BR');

  const [receiptNumber] = useState(
    `ZL-${Date.now().toString().slice(-8)}`
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectPlan = (index: number) => {
    setSelectedPlan(index);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setStep(3);
  };

  const handleDownloadReceipt = () => {
    window.print();
  };

  const handleTracking = () => {
    navigate('/pedido', {
      state: {
        planName: currentPlan.name,
        price: currentPlan.price,
        period: currentPlan.period,
        receiptNumber,
      },
    });
  };

  return (
    <div className="checkout-page">

      {/* HEADER */}
      <header className="checkout-header">
        <div className="checkout-header-content">

          <span
            className="logo"
            onClick={() => navigate('/')}
          >
            ZELOOS
          </span>

          <div className="checkout-steps">

            {/* ETAPA 1 */}
            <div
              className={`step ${
                step >= 1 ? 'active' : ''
              }`}
            >
              <span className="step-number">1</span>

              <span className="step-label">
                Plano
              </span>
            </div>

            <div
              className={`step-line ${
                step >= 2 ? 'active' : ''
              }`}
            />

            {/* ETAPA 2 */}
            <div
              className={`step ${
                step >= 2 ? 'active' : ''
              }`}
            >
              <span className="step-number">2</span>

              <span className="step-label">
                Pagamento
              </span>
            </div>

            <div
              className={`step-line ${
                step >= 3 ? 'active' : ''
              }`}
            />

            {/* ETAPA 3 */}
            <div
              className={`step ${
                step >= 3 ? 'active' : ''
              }`}
            >
              <span className="step-number">3</span>

              <span className="step-label">
                Confirmação
              </span>
            </div>

          </div>

        </div>
      </header>


      <div className="checkout-container">

        {/* ================================================= */}
        {/* ETAPA 1 - PLANOS */}
        {/* ================================================= */}

        {step === 1 && (

          <div className="checkout-step">

            <button
              className="back-button"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} />
              Voltar
            </button>

            <h1 className="checkout-title">
              Escolha seu Plano
            </h1>

            <p className="checkout-subtitle">
              Selecione o plano ideal para você
            </p>


            <div className="plans-grid">

              {plans.map((plan, index) => (

                <div
                  key={plan.name}
                  className={`plan-card ${
                    selectedPlan === index
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => setSelectedPlan(index)}
                >

                  {/* MAIS POPULAR */}
                  {index === 1 && (
                    <span className="popular-badge">
                      MAIS POPULAR
                    </span>
                  )}


                  {/* NOME */}
                  <h3>
                    {plan.name}
                  </h3>


                  {/* SEM PREÇO AQUI */}
                  <div className="plan-price plan-price-hidden">
                    <span>
                      Confira todos os benefícios
                    </span>
                  </div>


                  {/* BENEFÍCIOS */}
                  <ul className="plan-features">

                    {plan.features.map((feature) => (

                      <li key={feature}>

                        <CheckCircle size={16} />

                        {feature}

                      </li>

                    ))}

                  </ul>


                  {/* SELECIONAR */}
                  <button
                    type="button"
                    className={`plan-select-btn ${
                      selectedPlan === index
                        ? 'selected'
                        : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(index);
                    }}
                  >
                    Selecionar
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* ETAPA 2 - PAGAMENTO */}
        {/* ================================================= */}

        {step === 2 && (

          <div className="checkout-step">

            <button
              className="back-button"
              onClick={() => setStep(1)}
            >
              <ArrowLeft size={20} />
              Voltar
            </button>


            <h1 className="checkout-title">
              Pagamento
            </h1>

            <p className="checkout-subtitle">
              Finalize sua assinatura do ZELOOS
            </p>


            <div className="payment-layout">


              {/* RESUMO DO PLANO */}
              <div className="payment-summary">

                <div className="summary-icon">
                  <Smartphone size={28} />
                </div>


                <h2>
                  {currentPlan.name}
                </h2>


                {/* PREÇO APARECE AQUI */}
                <div className="summary-price">
                  {currentPlan.price}

                  <span>
                    {currentPlan.period}
                  </span>
                </div>


                <div className="summary-divider" />


                <h3>
                  Seu plano inclui:
                </h3>


                <ul>

                  {currentPlan.features.map((feature) => (

                    <li key={feature}>

                      <CheckCircle size={16} />

                      {feature}

                    </li>

                  ))}

                </ul>


                <button
                  type="button"
                  className="change-plan-btn"
                  onClick={() => setStep(1)}
                >
                  Alterar plano
                </button>

              </div>


              {/* FORMULÁRIO */}
              <form
                onSubmit={handleSubmit}
                className="payment-form"
              >

                <h2>
                  Dados do cartão
                </h2>


                <div className="form-group full-width">

                  <label htmlFor="cardNumber">
                    Número do cartão
                  </label>

                  <div className="input-with-icon">

                    <input
                      id="cardNumber"
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      maxLength={19}
                      required
                    />

                    <CreditCard size={20} />

                  </div>

                </div>


                <div className="form-group full-width">

                  <label htmlFor="cardName">
                    Nome no cartão
                  </label>

                  <input
                    id="cardName"
                    type="text"
                    name="cardName"
                    placeholder="Nome completo"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                  />

                </div>


                <div className="form-row">

                  <div className="form-group">

                    <label htmlFor="expiry">
                      Validade
                    </label>

                    <input
                      id="expiry"
                      type="text"
                      name="expiry"
                      placeholder="MM/AA"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      maxLength={5}
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label htmlFor="cvv">
                      CVV
                    </label>

                    <input
                      id="cvv"
                      type="password"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      maxLength={4}
                      required
                    />

                  </div>

                </div>


                <div className="payment-security">

                  <Shield size={20} />

                  <span>
                    Seus dados são protegidos por
                    conexão segura.
                  </span>

                </div>


                {/* PREÇO NO BOTÃO */}
                <button
                  type="submit"
                  className="checkout-submit-btn"
                >
                  Pagar {currentPlan.price}
                </button>


                <p className="payment-note">
                  Esta é uma tela de demonstração.
                  O processamento real do pagamento
                  será integrado posteriormente.
                </p>

              </form>

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* ETAPA 3 - CONFIRMAÇÃO */}
        {/* ================================================= */}

        {step === 3 && (

          <div className="checkout-step success-step">

            <div className="success-content">


              <div className="success-icon">

                <CheckCircle size={80} />

              </div>


              <h1 className="success-title">
                Pagamento aprovado!
              </h1>


              <p className="success-message">
                Sua assinatura do ZELOOS foi
                realizada com sucesso.
              </p>


              {/* COMPROVANTE */}
              <div className="receipt-card">

                <div className="receipt-header">

                  <div>

                    <span className="receipt-brand">
                      ZELOOS
                    </span>

                    <p>
                      Comprovante de assinatura
                    </p>

                  </div>


                  <div className="receipt-status">

                    <CheckCircle size={18} />

                    Pago

                  </div>

                </div>


                <div className="receipt-divider" />


                <div className="receipt-number">

                  <span>
                    Nº do comprovante
                  </span>

                  <strong>
                    {receiptNumber}
                  </strong>

                </div>


                <div className="receipt-divider" />


                <div className="receipt-details">

                  <div className="receipt-row">

                    <span>
                      Plano
                    </span>

                    <strong>
                      {currentPlan.name}
                    </strong>

                  </div>


                  <div className="receipt-row">

                    <span>
                      Periodicidade
                    </span>

                    <strong>
                      {currentPlan.period === '/mês'
                        ? 'Mensal'
                        : 'Anual'}
                    </strong>

                  </div>


                  <div className="receipt-row">

                    <span>
                      Data
                    </span>

                    <strong>
                      {today}
                    </strong>

                  </div>


                  <div className="receipt-row">

                    <span>
                      Forma de pagamento
                    </span>

                    <strong>
                      Cartão de crédito
                    </strong>

                  </div>

                </div>


                <div className="receipt-divider" />


                {/* TOTAL */}
                <div className="receipt-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    {currentPlan.price}
                  </strong>

                </div>


                <div className="receipt-security">

                  <Shield size={18} />

                  <span>
                    Pagamento processado com segurança.
                  </span>

                </div>

              </div>


              {/* AÇÕES */}
              <div className="success-actions">

                <button
                  className="receipt-download-btn"
                  onClick={handleDownloadReceipt}
                >
                  <Download size={18} />

                  Baixar comprovante
                </button>


                <button
                  className="success-btn"
                  onClick={handleTracking}
                >
                  <PackageCheck size={18} />

                  Acompanhar assinatura
                </button>

              </div>


              <p className="receipt-observation">
                Este documento é um comprovante
                demonstrativo da assinatura.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default Checkout;