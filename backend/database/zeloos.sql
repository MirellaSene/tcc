-- =====================================================================
-- ZELOOS - Banco de dados (MySQL / MariaDB)
-- Para criar: abra no HeidiSQL e execute o script inteiro (F9).
-- ATENÇÃO: o script recria o banco "zeloos" do zero (apaga os dados).
-- =====================================================================

DROP DATABASE IF EXISTS zeloos;
CREATE DATABASE zeloos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE zeloos;

-- ---------------------------------------------------------------------
-- Usuários
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username      VARCHAR(50)  NOT NULL,
  email         VARCHAR(255) NOT NULL,
  senha_hash    VARCHAR(255) NOT NULL,
  criado_em     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuarios_username (username),
  UNIQUE KEY uk_usuarios_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Configurações / permissões do usuário (tela de Configurações)
-- ---------------------------------------------------------------------
CREATE TABLE configuracoes_usuario (
  usuario_id            INT UNSIGNED NOT NULL,
  permitir_localizacao  TINYINT(1)   NOT NULL DEFAULT 1,
  permitir_notificacoes TINYINT(1)   NOT NULL DEFAULT 1,
  atualizado_em         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id),
  CONSTRAINT fk_config_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Planos (tela de Checkout)
-- ---------------------------------------------------------------------
CREATE TABLE planos (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nome             VARCHAR(50)   NOT NULL,
  preco            DECIMAL(10,2) NOT NULL,
  periodicidade    ENUM('mensal','anual') NOT NULL,
  max_dispositivos INT UNSIGNED  NOT NULL DEFAULT 1,
  dias_historico   INT UNSIGNED  NULL COMMENT 'NULL = ilimitado',
  mais_popular     TINYINT(1)    NOT NULL DEFAULT 0,
  ativo            TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_planos_nome (nome)
) ENGINE=InnoDB;

CREATE TABLE plano_beneficios (
  id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  plano_id  INT UNSIGNED NOT NULL,
  descricao VARCHAR(150) NOT NULL,
  ordem     INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT fk_beneficio_plano FOREIGN KEY (plano_id)
    REFERENCES planos (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Assinaturas (tela de Acompanhar assinatura)
-- ---------------------------------------------------------------------
CREATE TABLE assinaturas (
  id                 INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  usuario_id         INT UNSIGNED  NOT NULL,
  plano_id           INT UNSIGNED  NOT NULL,
  numero_comprovante VARCHAR(20)   NOT NULL,
  valor              DECIMAL(10,2) NOT NULL,
  status             ENUM('pendente','em_ativacao','ativa','cancelada','expirada') NOT NULL DEFAULT 'pendente',
  data_inicio        DATETIME      NULL,
  data_fim           DATETIME      NULL,
  criado_em          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_assinaturas_comprovante (numero_comprovante),
  KEY idx_assinaturas_usuario (usuario_id),
  CONSTRAINT fk_assinatura_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_assinatura_plano FOREIGN KEY (plano_id)
    REFERENCES planos (id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Pagamentos
-- Nunca guardamos o número completo do cartão nem o CVV,
-- apenas os 4 últimos dígitos e o nome do titular.
-- ---------------------------------------------------------------------
CREATE TABLE pagamentos (
  id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  assinatura_id  INT UNSIGNED  NOT NULL,
  valor          DECIMAL(10,2) NOT NULL,
  metodo         ENUM('cartao_credito') NOT NULL DEFAULT 'cartao_credito',
  status         ENUM('pendente','aprovado','recusado','estornado') NOT NULL DEFAULT 'pendente',
  cartao_final   CHAR(4)       NULL,
  nome_titular   VARCHAR(150)  NULL,
  pago_em        DATETIME      NULL,
  criado_em      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pagamentos_assinatura (assinatura_id),
  CONSTRAINT fk_pagamento_assinatura FOREIGN KEY (assinatura_id)
    REFERENCES assinaturas (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Dispositivos (pulseiras) do usuário
-- ---------------------------------------------------------------------
CREATE TABLE dispositivos (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id    INT UNSIGNED NOT NULL,
  nome          VARCHAR(100) NOT NULL,
  identificador VARCHAR(100) NOT NULL COMMENT 'Número de série / IMEI',
  bateria       TINYINT UNSIGNED NULL,
  ativo         TINYINT(1)   NOT NULL DEFAULT 1,
  criado_em     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_dispositivos_identificador (identificador),
  KEY idx_dispositivos_usuario (usuario_id),
  CONSTRAINT fk_dispositivo_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Localizações (rastreamento em tempo real / histórico de rotas)
-- ---------------------------------------------------------------------
CREATE TABLE localizacoes (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  dispositivo_id INT UNSIGNED    NOT NULL,
  latitude       DECIMAL(10,7)   NOT NULL,
  longitude      DECIMAL(10,7)   NOT NULL,
  precisao_m     DECIMAL(8,2)    NULL,
  registrado_em  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_localizacoes_dispositivo_data (dispositivo_id, registrado_em),
  CONSTRAINT fk_localizacao_dispositivo FOREIGN KEY (dispositivo_id)
    REFERENCES dispositivos (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Alertas (alertas inteligentes / notificações)
-- ---------------------------------------------------------------------
CREATE TABLE alertas (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id     INT UNSIGNED NOT NULL,
  dispositivo_id INT UNSIGNED NULL,
  tipo           ENUM('bateria_baixa','fora_da_area','sos','sistema') NOT NULL,
  mensagem       VARCHAR(255) NOT NULL,
  lido           TINYINT(1)   NOT NULL DEFAULT 0,
  criado_em      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_alertas_usuario (usuario_id, lido),
  CONSTRAINT fk_alerta_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_alerta_dispositivo FOREIGN KEY (dispositivo_id)
    REFERENCES dispositivos (id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================================
-- Dados iniciais: planos exibidos no Checkout
-- =====================================================================
INSERT INTO planos (id, nome, preco, periodicidade, max_dispositivos, dias_historico, mais_popular) VALUES
  (1, 'Mensal',  49.90, 'mensal', 1, 30,   0),
  (2, 'Anual',  499.00, 'anual',  1, 60,   1),
  (3, 'Família', 799.00, 'anual', 5, NULL, 0);

INSERT INTO plano_beneficios (plano_id, descricao, ordem) VALUES
  (1, 'Rastreamento em tempo real', 1),
  (1, 'Alertas inteligentes',       2),
  (1, 'Suporte 24/7',               3),

  (2, 'Rastreamento em tempo real', 1),
  (2, 'Alertas inteligentes',       2),
  (2, 'Suporte 24/7',               3),
  (2, 'Histórico de 60 dias',       4),
  (2, '10% de desconto',            5),

  (3, 'Até 5 dispositivos',         1),
  (3, 'Rastreamento em tempo real', 2),
  (3, 'Alertas inteligentes',       3),
  (3, 'Suporte prioritário',        4),
  (3, 'Histórico ilimitado',        5);
