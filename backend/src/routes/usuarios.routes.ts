import { Router } from 'express';
import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';
import { db } from '../database/connection.js';
import { requireAuth, type AuthRequest } from '../middlewares/auth.js';
import { HttpError } from '../utils/httpError.js';

export const usuariosRoutes = Router();
usuariosRoutes.use(requireAuth);

usuariosRoutes.get('/me/configuracoes', async (req: AuthRequest, res) => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT permitir_localizacao, permitir_notificacoes FROM configuracoes_usuario WHERE usuario_id = ?',
    [req.usuarioId],
  );
  const config = rows[0] ?? { permitir_localizacao: 1, permitir_notificacoes: 1 };
  res.json({
    permitir_localizacao: Boolean(config.permitir_localizacao),
    permitir_notificacoes: Boolean(config.permitir_notificacoes),
  });
});

usuariosRoutes.put('/me/configuracoes', async (req: AuthRequest, res) => {
  const { permitir_localizacao, permitir_notificacoes } = req.body ?? {};
  if (typeof permitir_localizacao !== 'boolean' || typeof permitir_notificacoes !== 'boolean') {
    throw new HttpError(400, 'Informe permitir_localizacao e permitir_notificacoes (true/false)');
  }

  await db.query(
    `INSERT INTO configuracoes_usuario (usuario_id, permitir_localizacao, permitir_notificacoes)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE permitir_localizacao = VALUES(permitir_localizacao),
                             permitir_notificacoes = VALUES(permitir_notificacoes)`,
    [req.usuarioId, permitir_localizacao, permitir_notificacoes],
  );
  res.json({ permitir_localizacao, permitir_notificacoes });
});

// Excluir conta (exige a senha para confirmar). Os dados relacionados são apagados em cascata.
usuariosRoutes.delete('/me', async (req: AuthRequest, res) => {
  const [rows] = await db.query<RowDataPacket[]>('SELECT senha_hash FROM usuarios WHERE id = ?', [req.usuarioId]);
  if (!rows[0]) throw new HttpError(404, 'Usuário não encontrado');
  if (!(await bcrypt.compare(String(req.body?.password ?? ''), rows[0].senha_hash))) {
    throw new HttpError(401, 'Senha incorreta');
  }

  await db.query('DELETE FROM usuarios WHERE id = ?', [req.usuarioId]);
  res.status(204).end();
});
