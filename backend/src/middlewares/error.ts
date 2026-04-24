import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation error', issues: err.issues });
  }
  const e = err as { status?: number; message?: string };
  console.error('[error]', err);
  res.status(e.status ?? 500).json({ message: e.message ?? 'Internal Server Error' });
}
