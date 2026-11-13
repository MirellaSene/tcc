import { Router } from 'express';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../database/connection.js';
import { requireAuth, type AuthRequest } from '../middlewares/auth.js';
import { HttpError } from '../utils/httpError.js';

export const alertasRoutes = Router();
alertasRoutes.use(requireAuth);

// ?naoLidos=true para trazer só os não lidos
alertasRoutes.get('/', async (req: AuthRequest, res) => {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, dispositivo_id, tipo, mensagem, lido, criado_em
       FROM alertas
      WHERE usuario_id = ? ${req.query.naoLidos === 'true' ? 'AND lido = 0' : ''}
      ORDER BY criado_em DESC, id DESC LIMIT 100`,
    [req.usuarioId],
  );
  res.json(rows.map((a) => ({ ...a, lido: Boolean(a.lido) })));
});

alertasRoutes.patch('/:id/lido', async (req: AuthRequest, res) => {
  const [result] = await db.query<ResultSetHeader>('UPDATE alertas SET lido = 1 WHERE id = ? AND usuario_id = ?', [
    Number(req.params.id),
    req.usuarioId,
  ]);
  if (!result.affectedRows) throw new HttpError(404, 'Alerta não encontrado');
  res.status(204).end();
});
