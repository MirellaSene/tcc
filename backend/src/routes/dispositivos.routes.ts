import { Router } from 'express';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../database/connection.js';
import { requireAuth, type AuthRequest } from '../middlewares/auth.js';
import { HttpError } from '../utils/httpError.js';

export const dispositivosRoutes = Router();
dispositivosRoutes.use(requireAuth);

async function buscarDispositivo(req: AuthRequest) {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT id, nome, identificador, bateria, ativo, criado_em FROM dispositivos WHERE id = ? AND usuario_id = ?',
    [Number(req.params.id), req.usuarioId],
  );
  if (!rows[0]) throw new HttpError(404, 'Dispositivo não encontrado');
  return rows[0];
}

dispositivosRoutes.get('/', async (req: AuthRequest, res) => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT id, nome, identificador, bateria, ativo, criado_em FROM dispositivos WHERE usuario_id = ? ORDER BY id',
    [req.usuarioId],
  );
  res.json(rows);
});

dispositivosRoutes.post('/', async (req: AuthRequest, res) => {
  const nome = String(req.body?.nome ?? '').trim();
  const identificador = String(req.body?.identificador ?? '').trim();
  if (!nome || !identificador) throw new HttpError(400, 'Informe nome e identificador do dispositivo');

  const [assinaturas] = await db.query<RowDataPacket[]>(
    `SELECT p.max_dispositivos
       FROM assinaturas a JOIN planos p ON p.id = a.plano_id
      WHERE a.usuario_id = ? AND a.status IN ('em_ativacao','ativa')
      ORDER BY p.max_dispositivos DESC LIMIT 1`,
    [req.usuarioId],
  );
  if (!assinaturas[0]) throw new HttpError(403, 'É necessário ter uma assinatura ativa');

  const [[{ total }]] = await db.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS total FROM dispositivos WHERE usuario_id = ?',
    [req.usuarioId],
  );
  if (total >= assinaturas[0].max_dispositivos) throw new HttpError(403, 'Limite de dispositivos do plano atingido');

  try {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO dispositivos (usuario_id, nome, identificador) VALUES (?, ?, ?)',
      [req.usuarioId, nome, identificador],
    );
    res.status(201).json({ id: result.insertId, nome, identificador });
  } catch (err) {
    if ((err as { code?: string }).code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Dispositivo já cadastrado');
    throw err;
  }
});

dispositivosRoutes.delete('/:id', async (req: AuthRequest, res) => {
  const dispositivo = await buscarDispositivo(req);
  await db.query('DELETE FROM dispositivos WHERE id = ?', [dispositivo.id]);
  res.status(204).end();
});

// Recebe uma nova posição enviada pela pulseira
dispositivosRoutes.post('/:id/localizacoes', async (req: AuthRequest, res) => {
  const dispositivo = await buscarDispositivo(req);
  const latitude = Number(req.body?.latitude);
  const longitude = Number(req.body?.longitude);
  const precisao = req.body?.precisao_m == null ? null : Number(req.body.precisao_m);
  const bateria = req.body?.bateria == null ? null : Number(req.body.bateria);

  if (!(Math.abs(latitude) <= 90) || !(Math.abs(longitude) <= 180)) throw new HttpError(400, 'Coordenadas inválidas');

  await db.query(
    'INSERT INTO localizacoes (dispositivo_id, latitude, longitude, precisao_m) VALUES (?, ?, ?, ?)',
    [dispositivo.id, latitude, longitude, precisao],
  );
  if (bateria != null) {
    await db.query('UPDATE dispositivos SET bateria = ? WHERE id = ?', [bateria, dispositivo.id]);
    if (bateria <= 15) {
      await db.query(
        "INSERT INTO alertas (usuario_id, dispositivo_id, tipo, mensagem) VALUES (?, ?, 'bateria_baixa', ?)",
        [req.usuarioId, dispositivo.id, `Bateria de "${dispositivo.nome}" em ${bateria}%`],
      );
    }
  }
  res.status(201).end();
});

dispositivosRoutes.get('/:id/localizacoes/ultima', async (req: AuthRequest, res) => {
  const dispositivo = await buscarDispositivo(req);
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT latitude, longitude, precisao_m, registrado_em
       FROM localizacoes WHERE dispositivo_id = ? ORDER BY registrado_em DESC, id DESC LIMIT 1`,
    [dispositivo.id],
  );
  if (!rows[0]) throw new HttpError(404, 'Nenhuma localização registrada');
  res.json(rows[0]);
});

// Histórico de rotas: ?dias=30 (padrão 30, máximo 365)
dispositivosRoutes.get('/:id/localizacoes', async (req: AuthRequest, res) => {
  const dispositivo = await buscarDispositivo(req);
  const dias = Math.min(Math.max(Number(req.query.dias) || 30, 1), 365);
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT latitude, longitude, precisao_m, registrado_em
       FROM localizacoes
      WHERE dispositivo_id = ? AND registrado_em >= NOW() - INTERVAL ? DAY
      ORDER BY registrado_em`,
    [dispositivo.id, dias],
  );
  res.json(rows);
});
