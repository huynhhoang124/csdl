import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { LoginRequestSchema, type AuthUser } from '@qldh/shared';
import { SinhVien, CanBo, Ttcn } from '../models/index.js';
import { signToken } from '../lib/jwt.js';
import { authMiddleware, type AuthedRequest } from '../middlewares/auth.js';

export const authRouter = Router();

// Mật khẩu mặc định (hash bcrypt) — sinh ngược bằng bcrypt khi login
// Trong production, lưu hash vào bảng user riêng
const DEFAULT_HASHES = {
  student: bcrypt.hashSync('student123', 8),
  teacher: bcrypt.hashSync('teacher123', 8),
  dev: bcrypt.hashSync('dev123', 8),
};

authRouter.post('/login', async (req, res, next) => {
  try {
    const input = LoginRequestSchema.parse(req.body);

    if (input.role === 'dev') {
      const ok = input.username === 'dev@qldh.local' &&
        bcrypt.compareSync(input.password, DEFAULT_HASHES.dev);
      if (!ok) return res.status(401).json({ message: 'Sai tài khoản dev' });
      const user: AuthUser = { id: 'dev', username: input.username, displayName: 'Developer', role: 'dev', email: input.username };
      return res.json({ token: signToken({ sub: 'dev', role: 'dev' }), user });
    }

    if (input.role === 'student') {
      const sv = await SinhVien.findByPk(input.username) as unknown as { MSV: string; CCCD: string } | null;
      if (!sv) return res.status(401).json({ message: `Không tìm thấy SV ${input.username}` });
      if (!bcrypt.compareSync(input.password, DEFAULT_HASHES.student)) {
        return res.status(401).json({ message: 'Mật khẩu mặc định: student123' });
      }
      const tt = await Ttcn.findByPk(sv.CCCD) as unknown as { lastName?: string; name?: string } | null;
      const user: AuthUser = {
        id: sv.MSV, username: sv.MSV,
        displayName: `${tt?.lastName ?? ''} ${tt?.name ?? ''}`.trim() || sv.MSV,
        role: 'student', MSV: sv.MSV,
      };
      return res.json({ token: signToken({ sub: sv.MSV, role: 'student', MSV: sv.MSV }), user });
    }

    // teacher
    const cb = await CanBo.findByPk(input.username) as unknown as { MCB: string; CCCD: string } | null;
    if (!cb) return res.status(401).json({ message: `Không tìm thấy CB ${input.username}` });
    if (!bcrypt.compareSync(input.password, DEFAULT_HASHES.teacher)) {
      return res.status(401).json({ message: 'Mật khẩu mặc định: teacher123' });
    }
    const tt = await Ttcn.findByPk(cb.CCCD) as unknown as { lastName?: string; name?: string } | null;
    const user: AuthUser = {
      id: cb.MCB, username: cb.MCB,
      displayName: `${tt?.lastName ?? ''} ${tt?.name ?? ''}`.trim() || cb.MCB,
      role: 'teacher', MCB: cb.MCB,
    };
    return res.json({ token: signToken({ sub: cb.MCB, role: 'teacher', MCB: cb.MCB }), user });
  } catch (e) { next(e); }
});

authRouter.post('/logout', (_req, res) => res.json({ ok: true }));

authRouter.get('/me', authMiddleware, async (req: AuthedRequest, res, next) => {
  try {
    const u = req.user!;
    if (u.role === 'dev') {
      return res.json({ id: 'dev', username: 'dev@qldh.local', displayName: 'Developer', role: 'dev' });
    }
    if (u.role === 'student' && u.MSV) {
      const sv = await SinhVien.findByPk(u.MSV) as unknown as { MSV: string; CCCD: string } | null;
      if (!sv) return res.status(404).json({ message: 'Not found' });
      const tt = await Ttcn.findByPk(sv.CCCD) as unknown as { lastName?: string; name?: string } | null;
      return res.json({ id: sv.MSV, username: sv.MSV, displayName: `${tt?.lastName ?? ''} ${tt?.name ?? ''}`.trim(), role: 'student', MSV: sv.MSV });
    }
    if (u.role === 'teacher' && u.MCB) {
      const cb = await CanBo.findByPk(u.MCB) as unknown as { MCB: string; CCCD: string } | null;
      if (!cb) return res.status(404).json({ message: 'Not found' });
      const tt = await Ttcn.findByPk(cb.CCCD) as unknown as { lastName?: string; name?: string } | null;
      return res.json({ id: cb.MCB, username: cb.MCB, displayName: `${tt?.lastName ?? ''} ${tt?.name ?? ''}`.trim(), role: 'teacher', MCB: cb.MCB });
    }
    res.status(401).json({ message: 'Invalid token payload' });
  } catch (e) { next(e); }
});
