import { z } from 'zod';
import { ROLES } from '../constants.js';

export const LoginRequestSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  role: z.enum(ROLES),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const AuthUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  role: z.enum(ROLES),
  MSV: z.string().optional().nullable(),
  MCB: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const LoginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string().optional(),
  user: AuthUserSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
