import { z } from 'zod';

export const IdString = z.string().min(1).max(50);
export const ShortText = z.string().max(255).optional().nullable();
export const LongText = z.string().optional().nullable();
export const DateOnly = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date()])
  .optional()
  .nullable();
export const DateTime = z.union([z.string().datetime(), z.date()]).optional().nullable();
export const Money = z.number().nonnegative().optional().nullable();
