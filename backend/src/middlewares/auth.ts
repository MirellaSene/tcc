import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

export interface AuthRequest extends Request {
  usuarioId?: number;
}

export function signToken(usuarioId: number): string {
  return jwt.sign({ sub: String(usuarioId) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new HttpError(401, 'Token não informado');

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.usuarioId = Number(payload.sub);
    next();
  } catch {
    throw new HttpError(401, 'Token inválido ou expirado');
  }
}
