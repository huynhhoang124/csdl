import { Router } from 'express';
import { CanBo, LopTinChi, BangDiem } from '../models/index.js';
import { authMiddleware, requireRole, type AuthedRequest } from '../middlewares/auth.js';

export const teacherRouter = Router();

teacherRouter.use(authMiddleware);

teacherRouter.get('/:MCB', requireRole('teacher'), async (req, res, next) => {
  try {
    const cb = await CanBo.findByPk(req.params.MCB);
    if (!cb) return res.status(404).json({ message: 'Not found' });
    res.json(cb);
  } catch (e) { next(e); }
});

teacherRouter.get('/:MCB/classes', requireRole('teacher'), async (req: AuthedRequest, res, next) => {
  try {
    if (req.user?.role === 'teacher' && req.user.MCB !== req.params.MCB) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const classes = await LopTinChi.findAll({ where: { MCB: req.params.MCB } });
    res.json(classes);
  } catch (e) { next(e); }
});

teacherRouter.post('/grades', requireRole('teacher'), async (req, res, next) => {
  try {
    const { maMon, MSV, diemSo, diemChu } = req.body as { maMon: string; MSV: string; diemSo: number; diemChu: string };
    const existing = await BangDiem.findOne({ where: { maMon, MSV } });
    if (existing) {
      await BangDiem.update({ diemSo, diemChu }, { where: { maMon, MSV } });
      return res.json({ maMon, MSV, diemSo, diemChu });
    }
    const created = await BangDiem.create({ maMon, MSV, diemSo, diemChu });
    res.status(201).json(created);
  } catch (e) { next(e); }
});
