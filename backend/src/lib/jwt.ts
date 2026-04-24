import jwt from 'jsonwebtoken';
import type { Role } from '@qldh/shared';

const SECRET = process.env.JWT_SECRET ?? 'dev_only_change_me';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1d';

export interface JwtPayload {
  sub: string;           // user id (MSV | MCB | 'dev')
  role: Role;
  MSV?: string;
  MCB?: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
