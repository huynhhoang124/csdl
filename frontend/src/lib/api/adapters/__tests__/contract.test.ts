/**
 * Contract test — đảm bảo Mock và REST adapter cùng tuân thủ interface.
 * Chạy: `npm run test -w frontend`
 */
import { describe, it, expect } from 'vitest';
import {
  MockAuthRepository, MockStudentRepository, MockCourseRepository, MockGenericRepository,
} from '../mock';
import { SinhVienSchema, ALL_TABLES } from '@qldh/shared';

describe('IAuthRepository contract — mock', () => {
  const repo = new MockAuthRepository();

  it('login dev thành công', async () => {
    const r = await repo.login({ username: 'dev@qldh.local', password: 'dev123', role: 'dev' });
    expect(r.user.role).toBe('dev');
    expect(r.token).toMatch(/^mock\./);
  });

  it('login dev sai password → error', async () => {
    await expect(
      repo.login({ username: 'dev@qldh.local', password: 'wrong', role: 'dev' })
    ).rejects.toThrow();
  });

  it('login student SV001', async () => {
    const r = await repo.login({ username: 'SV0001', password: 'student123', role: 'student' });
    expect(r.user.role).toBe('student');
    expect(r.user.MSV).toBe('SV0001');
  });
});

describe('IStudentRepository contract — mock', () => {
  const repo = new MockStudentRepository();

  it('list trả về Page shape đúng', async () => {
    const page = await repo.list({ page: 1, pageSize: 10 });
    expect(page).toHaveProperty('items');
    expect(page).toHaveProperty('total');
    expect(page.items.length).toBeLessThanOrEqual(10);
  });

  it('findById + validate Zod shape', async () => {
    const page = await repo.list({ pageSize: 1 });
    const first = page.items[0];
    expect(first).toBeDefined();
    const sv = await repo.findById(first!.MSV);
    expect(sv).not.toBeNull();
    const result = SinhVienSchema.safeParse(sv);
    expect(result.success).toBe(true);
  });

  it('getGrades trả về mảng', async () => {
    const grades = await repo.getGrades('SV0001');
    expect(Array.isArray(grades)).toBe(true);
  });
});

describe('IGenericRepository contract — mock', () => {
  const repo = new MockGenericRepository();

  it('list tất cả 26 bảng', async () => {
    for (const t of ALL_TABLES) {
      const page = await repo.list(t, { pageSize: 1 });
      expect(page.total).toBeGreaterThanOrEqual(0);
    }
  });

  it('resetAndReseed hoàn thành', async () => {
    const r = await repo.resetAndReseed();
    expect(r.ok).toBe(true);
    expect(r.durationMs).toBeGreaterThanOrEqual(0);
  });
});

describe('ICourseRepository.canRegister — kiểm tra tiên quyết', () => {
  it('SV chưa học môn tiên quyết → missing', async () => {
    const repo = new MockCourseRepository();
    // Tạo dữ liệu giả: thực tế chạy với mockDB đã có sẵn
    const result = await repo.canRegister('SV0001', 'CNTT1', 'CTCNTT1', 'CNTT1');
    expect(result).toHaveProperty('ok');
    expect(result).toHaveProperty('missing');
    expect(Array.isArray(result.missing)).toBe(true);
  });
});
