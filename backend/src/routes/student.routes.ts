import { Router } from 'express';
import { QueryTypes } from 'sequelize';
import { SinhVien, BangDiem } from '../models/index.js';
import { authMiddleware, requireRole, type AuthedRequest } from '../middlewares/auth.js';

export const studentRouter = Router();

studentRouter.use(authMiddleware);

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
    const { sequelize } = await import('../models/index.js');
    const MSV = req.params.MSV;
    // Dùng subquery lấy MAX(soTinChi) theo maMon để tránh nhân bản khi 1 môn có nhiều dòng monDaoTao
    const query = `
      SELECT
        SUM(b.diemSo * COALESCE(mdt.soTinChi, 3)) /
        NULLIF(SUM(COALESCE(mdt.soTinChi, 3)), 0) AS CPA
      FROM bangDiem b
      LEFT JOIN (
        SELECT maMon, MAX(soTinChi) AS soTinChi
        FROM monDaoTao
        GROUP BY maMon
      ) mdt ON mdt.maMon = b.maMon
      WHERE b.MSV = :MSV
    `;
    const result = await sequelize.query(query, {
      replacements: { MSV },
      type: QueryTypes.SELECT,
    }) as any[];

    const CPA = result[0]?.CPA ? Number(result[0].CPA).toFixed(2) : 0;

    const { SinhVien } = await import('../models/index.js');
    await SinhVien.update({ GPA: CPA, CPA: CPA }, { where: { MSV } });

    res.json({ GPA: Number(CPA), CPA: Number(CPA) });
  } catch (e) { next(e); }
});

studentRouter.post('/:MSV/classes/:maLop/register', requireRole('student'), async (req: AuthedRequest, res, next) => {
  if (req.user!.MSV !== req.params.MSV) return res.status(403).json({ message: 'Forbidden' });
  
  const { sequelize, LopTinChi, SinhVien_LopTinChi } = await import('../models/index.js');
  const t = await sequelize.transaction();
  try {
    const { maLop } = req.params;
    // Pessimistic lock
    const lop = await LopTinChi.findByPk(maLop, { transaction: t, lock: true }) as any;
    if (!lop) throw new Error('Không tìm thấy lớp');
    if (lop.soLuongSinhVien >= lop.soLuongSinhVienMax) {
      throw new Error('Lớp đã đầy');
    }
    
    // Check if already registered
    const existing = await SinhVien_LopTinChi.findOne({ where: { MSV: req.params.MSV, maLop }, transaction: t });
    if (existing) throw new Error('Đã đăng ký lớp này rồi');

    const created = await SinhVien_LopTinChi.create({ MSV: req.params.MSV, maLop, ngayDangKy: new Date().toISOString().split('T')[0] }, { transaction: t });
    
    // Increase count
    lop.soLuongSinhVien += 1;
    await lop.save({ transaction: t });
    
    await t.commit();
    res.json(created);
  } catch (e: any) {
    await t.rollback();
    res.status(400).json({ message: e.message || 'Lỗi đăng ký' });
  }
});

studentRouter.delete('/:MSV/classes/:maLop/register', requireRole('student'), async (req: AuthedRequest, res, next) => {
  if (req.user!.MSV !== req.params.MSV) return res.status(403).json({ message: 'Forbidden' });
  
  const { sequelize, LopTinChi, SinhVien_LopTinChi } = await import('../models/index.js');
  const t = await sequelize.transaction();
  try {
    const { maLop } = req.params;
    const lop = await LopTinChi.findByPk(maLop, { transaction: t, lock: true }) as any;
    if (!lop) throw new Error('Không tìm thấy lớp');

    const existing = await SinhVien_LopTinChi.findOne({ where: { MSV: req.params.MSV, maLop }, transaction: t });
    if (!existing) throw new Error('Chưa đăng ký lớp này');

    await existing.destroy({ transaction: t });
    
    if (lop.soLuongSinhVien > 0) {
      lop.soLuongSinhVien -= 1;
      await lop.save({ transaction: t });
    }
    
    await t.commit();
    res.json({ success: true });
  } catch (e: any) {
    await t.rollback();
    res.status(400).json({ message: e.message || 'Lỗi hủy đăng ký' });
  }
});

studentRouter.get('/available-classes', requireRole('student', 'teacher', 'admin'), async (req, res, next) => {
  try {
    const { LopTinChi, Mon, CanBo, Ttcn } = await import('../models/index.js');
    const items = await LopTinChi.findAll({
      include: [
        { model: Mon },
        { 
          model: CanBo,
          include: [{ model: Ttcn }]
        }
      ]
    });
    res.json({ items });
  } catch (e) { next(e); }
});

studentRouter.get('/:MSV/classes', requireRole('student', 'teacher'), async (req: AuthedRequest, res, next) => {
  if (req.user?.role === 'student' && req.user.MSV !== req.params.MSV) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { SinhVien_LopTinChi } = await import('../models/index.js');
    const classes = await SinhVien_LopTinChi.findAll({ where: { MSV: req.params.MSV } });
    res.json(classes);
  } catch (e) { next(e); }
});

studentRouter.post('/:MSV/thesis/:maDoAn/join', requireRole('student'), async (req: AuthedRequest, res, next) => {
  if (req.user?.MSV !== req.params.MSV) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { SinhVien_DoAnTN, DoAnTN } = await import('../models/index.js');
    const doAn = await DoAnTN.findByPk(req.params.maDoAn);
    if (!doAn) throw new Error('Không tìm thấy đồ án');
    const existing = await SinhVien_DoAnTN.findOne({ where: { MSV: req.params.MSV, maDoAn: req.params.maDoAn } });
    if (existing) throw new Error('Bạn đã đăng ký đồ án này rồi');
    
    await SinhVien_DoAnTN.create({ MSV: req.params.MSV, maDoAn: req.params.maDoAn, ngayDangKy: new Date().toISOString().split('T')[0], trangThai: 'Dang thuc hien' });
    res.json({ success: true });
  } catch (e: any) { res.status(400).json({ message: e.message || 'Lỗi đăng ký đồ án' }); }
});

studentRouter.get('/thesis', requireRole('student', 'teacher'), async (req, res, next) => {
  try {
    const { DoAnTN } = await import('../models/index.js');
    const items = await DoAnTN.findAll();
    res.json({ items, total: items.length });
  } catch (e) { next(e); }
});

studentRouter.get('/research', requireRole('student', 'teacher'), async (req, res, next) => {
  try {
    const { NghienCuu } = await import('../models/index.js');
    const items = await NghienCuu.findAll();
    res.json({ items, total: items.length });
  } catch (e) { next(e); }
});

studentRouter.get('/:MSV/thesis', requireRole('student', 'teacher'), async (req: AuthedRequest, res, next) => {
  if (req.user?.role === 'student' && req.user.MSV !== req.params.MSV) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { SinhVien_DoAnTN } = await import('../models/index.js');
    const items = await SinhVien_DoAnTN.findAll({ where: { MSV: req.params.MSV } });
    res.json({ items, total: items.length });
  } catch (e) { next(e); }
});

studentRouter.get('/:MSV/research', requireRole('student', 'teacher'), async (req: AuthedRequest, res, next) => {
  if (req.user?.role === 'student' && req.user.MSV !== req.params.MSV) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { SinhVien_NghienCuu } = await import('../models/index.js');
    const items = await SinhVien_NghienCuu.findAll({ where: { MSV: req.params.MSV } });
    res.json({ items, total: items.length });
  } catch (e) { next(e); }
});

studentRouter.post('/:MSV/research/:maDeTai/join', requireRole('student'), async (req: AuthedRequest, res, next) => {
  if (req.user?.MSV !== req.params.MSV) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { SinhVien_NghienCuu, NghienCuu } = await import('../models/index.js');
    const nc = await NghienCuu.findByPk(req.params.maDeTai);
    if (!nc) throw new Error('Không tìm thấy đề tài');
    const existing = await SinhVien_NghienCuu.findOne({ where: { MSV: req.params.MSV, maDeTai: req.params.maDeTai } });
    if (existing) throw new Error('Bạn đã đăng ký tham gia đề tài này rồi');
    
    await SinhVien_NghienCuu.create({ MSV: req.params.MSV, maDeTai: req.params.maDeTai, MCB: (nc as any).MCB ?? '', ngayThamGia: new Date().toISOString().split('T')[0], trangThai: 'Dang tham gia' });
    res.json({ success: true });
  } catch (e: any) { res.status(400).json({ message: e.message || 'Lỗi đăng ký nghiên cứu' }); }
});

studentRouter.get('/:MSV', requireRole('student', 'teacher'), async (req, res, next) => {
  try {
    const sv = await SinhVien.findByPk(req.params.MSV);
    if (!sv) return res.status(404).json({ message: 'Not found' });
    res.json(sv);
  } catch (e) { next(e); }
});
