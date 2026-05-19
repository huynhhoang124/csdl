import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { LoginRequestSchema, type AuthUser } from '@qldh/shared';
import { SinhVien, CanBo, Ttcn } from '../models/index.js';
import { signToken } from '../lib/jwt.js';
import { authMiddleware, type AuthedRequest } from '../middlewares/auth.js';

export const authRouter = Router();

// Mật khẩu mặc định (dùng khi user chưa có matKhau riêng)
import { rateLimit } from 'express-rate-limit';

const DEFAULT_HASHES = {
  student: bcrypt.hashSync('student123', 8),
  teacher: bcrypt.hashSync('teacher123', 8),
  admin: bcrypt.hashSync('admin123', 8),
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { message: 'Quá nhiều lần thử đăng nhập sai, vui lòng thử lại sau 15 phút.' },
});

async function verifyPassword(CCCD: string, password: string, fallbackRole: keyof typeof DEFAULT_HASHES): Promise<boolean> {
  const tt = await Ttcn.findByPk(CCCD) as unknown as { matKhau?: string | null } | null;
  if (!tt) return false;
  
  if (tt.matKhau) {
    return bcrypt.compareSync(password, tt.matKhau);
  }
  
  // No fallback in production! Force them to have a password hash.
  throw new Error('Tài khoản chưa được thiết lập mật khẩu. Vui lòng liên hệ Admin.');
}

authRouter.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const input = LoginRequestSchema.parse(req.body);

    if (input.role === 'admin') {
      const cb = await CanBo.findByPk(input.username) as unknown as { MCB: string; CCCD: string; viTriCongViec?: string } | null;
      if (!cb) return res.status(401).json({ message: `Không tìm thấy cán bộ ${input.username}` });
      if (cb.viTriCongViec !== 'Admin') return res.status(403).json({ message: 'Tài khoản không có quyền Admin' });
      const ok = await verifyPassword(cb.CCCD, input.password, 'admin');
      if (!ok) return res.status(401).json({ message: 'Sai mật khẩu' });
      const tt = await Ttcn.findByPk(cb.CCCD) as unknown as { Ho?: string; Ten?: string } | null;
      const user: AuthUser = {
        id: cb.MCB, username: cb.MCB,
        displayName: `${tt?.Ho ?? ''} ${tt?.Ten ?? ''}`.trim() || cb.MCB,
        role: 'admin', MCB: cb.MCB,
      };
      return res.json({ token: signToken({ sub: cb.MCB, role: 'admin', MCB: cb.MCB }), user });
    }

    if (input.role === 'student') {
      const sv = await SinhVien.findByPk(input.username) as unknown as { MSV: string; CCCD: string } | null;
      if (!sv) return res.status(401).json({ message: `Không tìm thấy SV ${input.username}` });
      const ok = await verifyPassword(sv.CCCD, input.password, 'student');
      if (!ok) return res.status(401).json({ message: 'Sai mật khẩu' });
      const tt = await Ttcn.findByPk(sv.CCCD) as unknown as { Ho?: string; Ten?: string } | null;
      const user: AuthUser = {
        id: sv.MSV, username: sv.MSV,
        displayName: `${tt?.Ho ?? ''} ${tt?.Ten ?? ''}`.trim() || sv.MSV,
        role: 'student', MSV: sv.MSV,
      };
      return res.json({ token: signToken({ sub: sv.MSV, role: 'student', MSV: sv.MSV }), user });
    }

    // teacher
    const cb = await CanBo.findByPk(input.username) as unknown as { MCB: string; CCCD: string } | null;
    if (!cb) return res.status(401).json({ message: `Không tìm thấy CB ${input.username}` });
    const ok = await verifyPassword(cb.CCCD, input.password, 'teacher');
    if (!ok) return res.status(401).json({ message: 'Sai mật khẩu' });
    const tt = await Ttcn.findByPk(cb.CCCD) as unknown as { Ho?: string; Ten?: string } | null;
    const user: AuthUser = {
      id: cb.MCB, username: cb.MCB,
      displayName: `${tt?.Ho ?? ''} ${tt?.Ten ?? ''}`.trim() || cb.MCB,
      role: 'teacher', MCB: cb.MCB,
    };
    return res.json({ token: signToken({ sub: cb.MCB, role: 'teacher', MCB: cb.MCB }), user });
  } catch (e) { next(e); }
});

authRouter.post('/logout', (_req, res) => res.json({ ok: true }));

authRouter.get('/me', authMiddleware, async (req: AuthedRequest, res, next) => {
  try {
    const u = req.user!;
    if (u.role === 'student' && u.MSV) {
      const sv = await SinhVien.findByPk(u.MSV) as unknown as { MSV: string; CCCD: string } | null;
      if (!sv) return res.status(404).json({ message: 'Not found' });
      const tt = await Ttcn.findByPk(sv.CCCD) as unknown as { Ho?: string; Ten?: string } | null;
      return res.json({ id: sv.MSV, username: sv.MSV, displayName: `${tt?.Ho ?? ''} ${tt?.Ten ?? ''}`.trim(), role: 'student', MSV: sv.MSV });
    }
    if ((u.role === 'teacher' || u.role === 'admin') && u.MCB) {
      const cb = await CanBo.findByPk(u.MCB) as unknown as { MCB: string; CCCD: string } | null;
      if (!cb) return res.status(404).json({ message: 'Not found' });
      const tt = await Ttcn.findByPk(cb.CCCD) as unknown as { Ho?: string; Ten?: string } | null;
      return res.json({ id: cb.MCB, username: cb.MCB, displayName: `${tt?.Ho ?? ''} ${tt?.Ten ?? ''}`.trim(), role: u.role, MCB: cb.MCB });
    }
    res.status(401).json({ message: 'Invalid token payload' });
  } catch (e) { next(e); }
});
