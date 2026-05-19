import { Router } from 'express';
import { Op } from 'sequelize';
import { ALL_TABLES, type TableName } from '@qldh/shared';
import { MODELS, SinhVien, CanBo, Ttcn, Khoa, ChuyenNganh, Mon, LopTinChi, LopHanhChinh, BangDiem, HeDaoTao, Bac, ChuongTrinhDaoTao } from '../models/index.js';
import { authMiddleware, requireRole, type AuthedRequest } from '../middlewares/auth.js';
import { sequelize } from '../db.js';

export const adminRouter = Router();

adminRouter.use(authMiddleware);

// ============ DASHBOARD STATS ============
adminRouter.get('/stats', requireRole('admin'), async (_req, res, next) => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalCourses,
      totalClasses,
      totalDepartments,
      totalPrograms,
    ] = await Promise.all([
      SinhVien.count(),
      CanBo.count(),
      Mon.count(),
      LopTinChi.count(),
      Khoa.count(),
      ChuyenNganh.count(),
    ]);

    // GPA distribution
    const gpaRanges = await SinhVien.findAll({
      attributes: [
        [sequelize.literal(`CASE
          WHEN GPA >= 3.6 THEN 'Xuat sac'
          WHEN GPA >= 3.2 THEN 'Gioi'
          WHEN GPA >= 2.5 THEN 'Kha'
          WHEN GPA >= 2.0 THEN 'Trung binh'
          ELSE 'Yeu'
        END`), 'range'],
        [sequelize.fn('COUNT', sequelize.col('MSV')), 'count'],
      ],
      group: [sequelize.literal(`CASE
        WHEN GPA >= 3.6 THEN 'Xuat sac'
        WHEN GPA >= 3.2 THEN 'Gioi'
        WHEN GPA >= 2.5 THEN 'Kha'
        WHEN GPA >= 2.0 THEN 'Trung binh'
        ELSE 'Yeu'
      END`) as unknown as string],
      raw: true,
    });

    // Student status distribution
    const statusDist = await SinhVien.findAll({
      attributes: [
        'trangThai',
        [sequelize.fn('COUNT', sequelize.col('MSV')), 'count'],
      ],
      group: ['trangThai'],
      raw: true,
    });

    res.json({
      totalStudents,
      totalTeachers,
      totalCourses,
      totalClasses,
      totalDepartments,
      totalPrograms,
      gpaDistribution: gpaRanges,
      statusDistribution: statusDist,
    });
  } catch (e) { next(e); }
});

// ============ GENERIC CRUD FOR ALL TABLES ============

function getModel(name: string) {
  if (!ALL_TABLES.includes(name as TableName)) {
    throw Object.assign(new Error(`Bảng không hợp lệ: ${name}`), { status: 400 });
  }
  return MODELS[name as TableName];
}

// List with pagination + search
adminRouter.get('/tables/:table', requireRole('admin', 'student', 'teacher'), async (req: AuthedRequest, res, next) => {
  try {
    const table = req.params.table!;
    if (req.user?.role !== 'admin' && ['ttcn', 'canBo', 'bangDiem'].includes(table)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const Model = getModel(table);
    const page = Number(req.query.page ?? 1);
    const pageSize = Math.min(Number(req.query.pageSize ?? 20), 200);
    const search = (req.query.search as string) ?? '';

    const where = search
      ? {
          [Op.or]: Object.keys(Model.getAttributes())
            .filter((k) => Model.getAttributes()[k]?.type?.constructor.name.includes('STRING'))
            .map((k) => ({ [k]: { [Op.like]: `%${search}%` } })),
        }
      : {};

    const { count, rows } = await Model.findAndCountAll({
      where, limit: pageSize, offset: (page - 1) * pageSize,
    });
    res.json({ items: rows, total: count, page, pageSize });
  } catch (e) { next(e); }
});

// Create
adminRouter.post('/tables/:table', requireRole('admin', 'student'), async (req: AuthedRequest, res, next) => {
  try {
    const table = req.params.table!;
    // Security check: students can only write to specific tables for their own MSV
    if (req.user?.role === 'student') {
      const allowed = ['sinhVien_HocBong', 'sinhVien_DuHoc', 'sinhVien_SuKien', 'sinhVien_NghienCuu', 'sinhVien_DoAnTN'];
      if (!allowed.includes(table)) return res.status(403).json({ message: 'Forbidden' });
      if (req.body.MSV !== req.user.MSV) return res.status(403).json({ message: 'Forbidden: MSV mismatch' });
    }

    const Model = getModel(table);
    const created = await Model.create(req.body);

    // Auto-create corresponding record for student/staff
    if (req.params.table === 'ttcn') {
      const { CCCD, vaiTro } = req.body;
      if (vaiTro === 'Sinh vien') {
        await MODELS.sinhVien.create({ MSV: CCCD, CCCD, trangThai: 'Dang hoc', namHoc: new Date().getFullYear() }).catch(() => {});
      } else if (vaiTro === 'Giang vien' || vaiTro === 'Can bo') {
        await MODELS.canBo.create({ MCB: CCCD, CCCD, trangThai: 'Dang cong tac', viTriCongViec: vaiTro }).catch(() => {});
      }
    }

    res.status(201).json(created);
  } catch (e: any) {
    if (e.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: `Lỗi khóa ngoại: Bản ghi tham chiếu không tồn tại (${e.index})` });
    }
    if (e.name === 'SequelizeValidationError' || e.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: e.errors.map((err: any) => err.message).join(', ') });
    }
    next(e);
  }
});

// Upsert (Create or Update)
adminRouter.post('/tables/:table/upsert', requireRole('admin'), async (req, res, next) => {
  try {
    const Model = getModel(req.params.table!);
    const [record, created] = await Model.upsert(req.body);
    res.status(created ? 201 : 200).json(record);
  } catch (e: any) {
    if (e.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: `Lỗi khóa ngoại: Bản ghi tham chiếu không tồn tại (${e.index})` });
    }
    if (e.name === 'SequelizeValidationError' || e.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: e.errors.map((err: any) => err.message).join(', ') });
    }
    next(e);
  }
});

// Update
adminRouter.put('/tables/:table', requireRole('admin'), async (req, res, next) => {
  try {
    const Model = getModel(req.params.table!);
    const { pk, data } = req.body as { pk: Record<string, unknown>; data: Record<string, unknown> };
    const [n] = await Model.update(data, { where: pk });
    if (!n) return res.status(404).json({ message: 'Not found' });
    const updated = await Model.findOne({ where: pk });
    res.json(updated);
  } catch (e: any) {
    if (e.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: `Lỗi khóa ngoại: Bản ghi tham chiếu không tồn tại (${e.index})` });
    }
    if (e.name === 'SequelizeValidationError' || e.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: e.errors.map((err: any) => err.message).join(', ') });
    }
    next(e);
  }
});

// Delete
adminRouter.delete('/tables/:table', requireRole('admin', 'student'), async (req: AuthedRequest, res, next) => {
  try {
    const table = req.params.table!;
    const pk = req.body as Record<string, unknown>;

    // Security check: students can only delete from specific tables for their own MSV
    if (req.user?.role === 'student') {
      const allowed = ['sinhVien_HocBong', 'sinhVien_DuHoc', 'sinhVien_SuKien', 'sinhVien_NghienCuu', 'sinhVien_DoAnTN'];
      if (!allowed.includes(table)) return res.status(403).json({ message: 'Forbidden' });
      if (pk.MSV !== req.user.MSV) return res.status(403).json({ message: 'Forbidden: MSV mismatch' });
    }

    const Model = getModel(table);
    await Model.destroy({ where: pk });
    res.status(204).end();
  } catch (e) { next(e); }
});
