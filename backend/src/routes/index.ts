import { Router } from 'express';
import { alertasRoutes } from './alertas.routes.js';
import { assinaturasRoutes } from './assinaturas.routes.js';
import { authRoutes } from './auth.routes.js';
import { dispositivosRoutes } from './dispositivos.routes.js';
import { planosRoutes } from './planos.routes.js';
import { usuariosRoutes } from './usuarios.routes.js';

export const routes = Router();

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

routes.use('/auth', authRoutes);
routes.use('/planos', planosRoutes);
routes.use('/assinaturas', assinaturasRoutes);
routes.use('/usuarios', usuariosRoutes);
routes.use('/dispositivos', dispositivosRoutes);
routes.use('/alertas', alertasRoutes);
