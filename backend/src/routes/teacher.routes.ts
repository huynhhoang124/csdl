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

teacherRouter.get('/:MCB/thesis', requireRole('teacher'), async (req: AuthedRequest, res, next) => {
  try {
    const { DoAnTN, SinhVien_DoAnTN, SinhVien, Ttcn } = await import('../models/index.js');
    const items = await DoAnTN.findAll({
      include: [{
        model: SinhVien_DoAnTN,
        include: [{ model: SinhVien, include: [{ model: Ttcn }] }]
      }]
    });
    res.json({ items, total: items.length });
  } catch (e) { next(e); }
});

teacherRouter.get('/:MCB/research', requireRole('teacher'), async (req: AuthedRequest, res, next) => {
  try {
    const { NghienCuu, SinhVien_NghienCuu, SinhVien, Ttcn } = await import('../models/index.js');
    const mentored = await SinhVien_NghienCuu.findAll({ where: { MCB: req.params.MCB }, attributes: ['maDeTai'], raw: true });
    const maDeTaiList = [...new Set((mentored as any[]).map(r => r.maDeTai))];
    if (maDeTaiList.length === 0) {
      return res.json({ items: [], total: 0 });
    }
    const { Op } = await import('sequelize');
    const items = await NghienCuu.findAll({ 
      where: { maDeTai: { [Op.in]: maDeTaiList } },
      include: [{
        model: SinhVien_NghienCuu,
        include: [{ model: SinhVien, include: [{ model: Ttcn }] }]
      }]
    });
    res.json({ items, total: items.length });
  } catch (e) { next(e); }
});

teacherRouter.put('/:MCB/thesis/:maDoAn', requireRole('teacher'), async (req: AuthedRequest, res, next) => {
  try {
    if (req.user?.MCB !== req.params.MCB) return res.status(403).json({ message: 'Forbidden' });
    const { DoAnTN } = await import('../models/index.js');
    const { trangThai, diem } = req.body;
    await DoAnTN.update({ trangThai, diem }, { where: { maDoAn: req.params.maDoAn } });
    res.json({ success: true });
  } catch (e) { next(e); }
});

teacherRouter.put('/:MCB/research/:maDeTai', requireRole('teacher'), async (req: AuthedRequest, res, next) => {
  try {
    if (req.user?.MCB !== req.params.MCB) return res.status(403).json({ message: 'Forbidden' });
    const { NghienCuu } = await import('../models/index.js');
    const { moTa } = req.body;
    await NghienCuu.update({ moTa }, { where: { maDeTai: req.params.maDeTai } });
    res.json({ success: true });
  } catch (e) { next(e); }
});
