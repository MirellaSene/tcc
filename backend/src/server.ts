import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { db } from './database/connection.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { routes } from './routes/index.js';
import { HttpError } from './utils/httpError.js';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.use('/api', routes);

app.use(() => {
  throw new HttpError(404, 'Rota não encontrada');
});
app.use(errorHandler);

app.listen(env.port, async () => {
  console.log(`API rodando em http://localhost:${env.port}/api`);
  try {
    await db.query('SELECT 1');
    console.log(`Conectado ao banco "${env.db.database}" em ${env.db.host}:${env.db.port}`);
  } catch (err) {
    console.error('Não foi possível conectar ao banco de dados:', (err as Error).message);
  }
});
