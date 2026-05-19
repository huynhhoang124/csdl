import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation error', issues: err.issues });
  }
  const e = err as { status?: number; message?: string; name?: string; original?: { message?: string } };
  console.error('[error]', err);

  // Ưu tiên message thật, fallback sang SQL error gốc hoặc err.name
  const message =
    e.message ||
    e.original?.message ||
    e.name ||
    'Internal Server Error';

  const isDev = process.env.NODE_ENV !== 'production';
  res.status(e.status ?? 500).json({
    message,
    ...(isDev && e.original?.message ? { detail: e.original.message } : {}),
  });
}
