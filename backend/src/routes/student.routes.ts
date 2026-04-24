import { Router } from 'express';
import { SinhVien, BangDiem } from '../models/index.js';
import { authMiddleware, requireRole, type AuthedRequest } from '../middlewares/auth.js';

export const studentRouter = Router();

studentRouter.use(authMiddleware);

studentRouter.get('/:MSV', requireRole('student', 'teacher'), async (req, res, next) => {
  try {
    const sv = await SinhVien.findByPk(req.params.MSV);
    if (!sv) return res.status(404).json({ message: 'Not found' });
    res.json(sv);
  } catch (e) { next(e); }
});

studentRouter.get('/:MSV/grades', requireRole('student', 'teacher'), async (req: AuthedRequest, res, next) => {
  try {
    // SV chỉ xem điểm của chính mình
    if (req.user?.role === 'student' && req.user.MSV !== req.params.MSV) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const grades = await BangDiem.findAll({ where: { MSV: req.params.MSV } });
    res.json(grades);
  } catch (e) { next(e); }
});

studentRouter.get('/:MSV/gpa', requireRole('student', 'teacher'), async (req, res, next) => {
  try {
    const sv = await SinhVien.findByPk(req.params.MSV) as unknown as { GPA?: number; CPA?: number } | null;
    res.json({ GPA: sv?.GPA ?? 0, CPA: sv?.CPA ?? 0 });
  } catch (e) { next(e); }
});
