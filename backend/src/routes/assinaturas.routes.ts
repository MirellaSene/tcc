import { Router } from 'express';
import { randomInt } from 'node:crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../database/connection.js';
import { requireAuth, type AuthRequest } from '../middlewares/auth.js';
import { HttpError } from '../utils/httpError.js';

export const assinaturasRoutes = Router();
assinaturasRoutes.use(requireAuth);

const SELECT_ASSINATURA = `
  SELECT a.id, a.numero_comprovante, a.valor, a.status, a.data_inicio, a.data_fim, a.criado_em,
         p.id AS plano_id, p.nome AS plano_nome, p.periodicidade,
         pg.status AS pagamento_status, pg.metodo AS pagamento_metodo, pg.cartao_final, pg.pago_em
    FROM assinaturas a
    JOIN planos p ON p.id = a.plano_id
    LEFT JOIN pagamentos pg ON pg.assinatura_id = a.id
   WHERE a.usuario_id = ?`;

function validarCartao(cartao: Record<string, unknown> | undefined) {
  const numero = String(cartao?.numero ?? '').replace(/\D/g, '');
  const nome = String(cartao?.nome ?? '').trim();
  const validade = String(cartao?.validade ?? '');
  const cvv = String(cartao?.cvv ?? '');

  if (numero.length < 13 || numero.length > 19) throw new HttpError(400, 'Número do cartão inválido');
  if (nome.length < 3) throw new HttpError(400, 'Nome no cartão inválido');
  if (!/^\d{3,4}$/.test(cvv)) throw new HttpError(400, 'CVV inválido');

  const match = /^(\d{2})\/(\d{2})$/.exec(validade);
  const mes = Number(match?.[1]);
  const ano = 2000 + Number(match?.[2]);
  const hoje = new Date();
  if (!match || mes < 1 || mes > 12 || ano < hoje.getFullYear() || (ano === hoje.getFullYear() && mes < hoje.getMonth() + 1)) {
    throw new HttpError(400, 'Validade do cartão inválida ou expirada');
  }

  return { final: numero.slice(-4), nome };
}

assinaturasRoutes.get('/', async (req: AuthRequest, res) => {
  const [rows] = await db.query<RowDataPacket[]>(`${SELECT_ASSINATURA} ORDER BY a.criado_em DESC`, [req.usuarioId]);
  res.json(rows);
});

assinaturasRoutes.get('/:numero', async (req: AuthRequest, res) => {
  const [rows] = await db.query<RowDataPacket[]>(`${SELECT_ASSINATURA} AND a.numero_comprovante = ?`, [
    req.usuarioId,
    req.params.numero,
  ]);
  if (!rows[0]) throw new HttpError(404, 'Assinatura não encontrada');
  res.json(rows[0]);
});

// Pagamento simulado: aprova sempre que os dados do cartão forem válidos.
// O número completo do cartão e o CVV nunca são salvos.
assinaturasRoutes.post('/', async (req: AuthRequest, res) => {
  const planoId = Number(req.body?.planoId);
  const cartao = validarCartao(req.body?.cartao);

  const [planos] = await db.query<RowDataPacket[]>(
    'SELECT id, preco, periodicidade FROM planos WHERE id = ? AND ativo = 1',
    [planoId],
  );
  const plano = planos[0];
  if (!plano) throw new HttpError(404, 'Plano não encontrado');

  const numeroComprovante = `ZL-${String(randomInt(0, 100_000_000)).padStart(8, '0')}`;
  const intervalo = plano.periodicidade === 'mensal' ? 'MONTH' : 'YEAR';

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [assinatura] = await conn.query<ResultSetHeader>(
      `INSERT INTO assinaturas (usuario_id, plano_id, numero_comprovante, valor, status, data_inicio, data_fim)
       VALUES (?, ?, ?, ?, 'em_ativacao', NOW(), DATE_ADD(NOW(), INTERVAL 1 ${intervalo}))`,
      [req.usuarioId, plano.id, numeroComprovante, plano.preco],
    );
    await conn.query(
      `INSERT INTO pagamentos (assinatura_id, valor, status, cartao_final, nome_titular, pago_em)
       VALUES (?, ?, 'aprovado', ?, ?, NOW())`,
      [assinatura.insertId, plano.preco, cartao.final, cartao.nome],
    );
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  const [rows] = await db.query<RowDataPacket[]>(`${SELECT_ASSINATURA} AND a.numero_comprovante = ?`, [
    req.usuarioId,
    numeroComprovante,
  ]);
  res.status(201).json(rows[0]);
});

assinaturasRoutes.patch('/:numero/cancelar', async (req: AuthRequest, res) => {
  const [result] = await db.query<ResultSetHeader>(
    `UPDATE assinaturas SET status = 'cancelada'
      WHERE usuario_id = ? AND numero_comprovante = ? AND status <> 'cancelada'`,
    [req.usuarioId, req.params.numero],
  );
  if (!result.affectedRows) throw new HttpError(404, 'Assinatura não encontrada ou já cancelada');
  res.status(204).end();
});
