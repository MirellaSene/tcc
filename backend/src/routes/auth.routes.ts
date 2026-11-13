import { Router } from 'express';
import bcrypt from 'bcryptjs';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../database/connection.js';
import { requireAuth, signToken, type AuthRequest } from '../middlewares/auth.js';
import { HttpError } from '../utils/httpError.js';

export const authRoutes = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

authRoutes.post('/register', async (req, res) => {
  const username = String(req.body?.username ?? '').trim();
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  if (username.length < 3 || username.length > 50) throw new HttpError(400, 'Username deve ter entre 3 e 50 caracteres');
  if (!EMAIL_REGEX.test(email)) throw new HttpError(400, 'Email inválido');
  if (password.length < 6) throw new HttpError(400, 'A senha deve ter pelo menos 6 caracteres');

  const [existentes] = await db.query<RowDataPacket[]>(
    'SELECT username, email FROM usuarios WHERE username = ? OR email = ?',
    [username, email],
  );
  if (existentes.some((u) => u.username === username)) throw new HttpError(409, 'Username já está em uso');
  if (existentes.length) throw new HttpError(409, 'Email já está cadastrado');

  const senhaHash = await bcrypt.hash(password, 10);
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO usuarios (username, email, senha_hash) VALUES (?, ?, ?)',
    [username, email, senhaHash],
  );
  await db.query('INSERT INTO configuracoes_usuario (usuario_id) VALUES (?)', [result.insertId]);

  res.status(201).json({
    token: signToken(result.insertId),
    usuario: { id: result.insertId, username, email },
  });
});

authRoutes.post('/login', async (req, res) => {
  const login = String(req.body?.username ?? '').trim();
  const password = String(req.body?.password ?? '');
  if (!login || !password) throw new HttpError(400, 'Informe usuário e senha');

  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT id, username, email, senha_hash FROM usuarios WHERE username = ? OR email = ? LIMIT 1',
    [login, login.toLowerCase()],
  );
  const usuario = rows[0];
  if (!usuario || !(await bcrypt.compare(password, usuario.senha_hash))) {
    throw new HttpError(401, 'Usuário ou senha incorretos');
  }

  res.json({
    token: signToken(usuario.id),
    usuario: { id: usuario.id, username: usuario.username, email: usuario.email },
  });
});

authRoutes.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT id, username, email, criado_em FROM usuarios WHERE id = ?',
    [req.usuarioId],
  );
  if (!rows[0]) throw new HttpError(404, 'Usuário não encontrado');
  res.json(rows[0]);
});
