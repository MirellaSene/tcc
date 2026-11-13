import { Router } from 'express';
import type { RowDataPacket } from 'mysql2';
import { db } from '../database/connection.js';
import { HttpError } from '../utils/httpError.js';

export const planosRoutes = Router();

async function buscarPlanos(id?: number) {
  const [planos] = await db.query<RowDataPacket[]>(
    `SELECT id, nome, preco, periodicidade, max_dispositivos, dias_historico, mais_popular
       FROM planos
      WHERE ativo = 1 ${id ? 'AND id = ?' : ''}
      ORDER BY id`,
    id ? [id] : [],
  );
  if (!planos.length) return [];

  const [beneficios] = await db.query<RowDataPacket[]>(
    'SELECT plano_id, descricao FROM plano_beneficios WHERE plano_id IN (?) ORDER BY plano_id, ordem',
    [planos.map((p) => p.id)],
  );

  return planos.map((p) => ({
    ...p,
    mais_popular: Boolean(p.mais_popular),
    beneficios: beneficios.filter((b) => b.plano_id === p.id).map((b) => b.descricao),
  }));
}

planosRoutes.get('/', async (_req, res) => {
  res.json(await buscarPlanos());
});

planosRoutes.get('/:id', async (req, res) => {
  const [plano] = await buscarPlanos(Number(req.params.id) || -1);
  if (!plano) throw new HttpError(404, 'Plano não encontrado');
  res.json(plano);
});
