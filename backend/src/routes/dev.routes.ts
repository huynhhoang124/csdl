import { Router } from 'express';
import { Op } from 'sequelize';
import { ALL_TABLES, type TableName } from '@qldh/shared';
import { MODELS } from '../models/index.js';
import { authMiddleware, requireRole } from '../middlewares/auth.js';

export const devRouter = Router();

devRouter.use(authMiddleware, requireRole('dev'));

function getModel(name: string) {
  if (!ALL_TABLES.includes(name as TableName)) {
    throw Object.assign(new Error(`Bảng không hợp lệ: ${name}`), { status: 400 });
  }
  return MODELS[name as TableName];
}

devRouter.get('/tables/:table', async (req, res, next) => {
  try {
    const Model = getModel(req.params.table);
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

devRouter.post('/tables/:table', async (req, res, next) => {
  try {
    const Model = getModel(req.params.table);
    const created = await Model.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

devRouter.put('/tables/:table', async (req, res, next) => {
  try {
    const Model = getModel(req.params.table);
    const { pk, data } = req.body as { pk: Record<string, unknown>; data: Record<string, unknown> };
    const [n] = await Model.update(data, { where: pk });
    if (!n) return res.status(404).json({ message: 'Not found' });
    const updated = await Model.findOne({ where: pk });
    res.json(updated);
  } catch (e) { next(e); }
});

devRouter.delete('/tables/:table', async (req, res, next) => {
  try {
    const Model = getModel(req.params.table);
    const pk = req.body as Record<string, unknown>;
    await Model.destroy({ where: pk });
    res.status(204).end();
  } catch (e) { next(e); }
});

devRouter.post('/reset-and-reseed', async (_req, res, next) => {
  try {
    const t0 = Date.now();
    // Trigger sequelize-cli programmatically — đơn giản: chạy lệnh qua child_process
    const { execSync } = await import('node:child_process');
    execSync('npx sequelize-cli db:seed:undo:all', { stdio: 'ignore' });
    execSync('npx sequelize-cli db:migrate:undo:all', { stdio: 'ignore' });
    execSync('npx sequelize-cli db:migrate', { stdio: 'ignore' });
    execSync('npx sequelize-cli db:seed:all', { stdio: 'ignore' });
    res.json({ ok: true, durationMs: Date.now() - t0 });
  } catch (e) { next(e); }
});
