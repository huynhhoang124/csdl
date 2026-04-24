/**
 * Mock adapters — dùng MockDatabase faker-powered.
 * Implement đầy đủ các contract để FE chạy offline hoàn toàn.
 */
import type {
  IAuthRepository, IStudentRepository, ITeacherRepository,
  ICourseRepository, IClassRepository, IGradeRepository, IGenericRepository,
  ListParams, Page,
} from '../../contracts';
import type {
  SinhVien, CanBo, Mon, MonDaoTao, MonTienQuyet, BangDiem,
  LopTinChi, LopHanhChinh, SinhVien_LopTinChi,
  LoginRequest, LoginResponse, AuthUser, TableName,
} from '@qldh/shared';
import { db, resetDB } from './mockDatabase';
import { paginate, delay } from './helpers';

// UTF-8 safe base64 (browser + jsdom)
function encodeToken(obj: unknown): string {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
function decodeToken<T>(b64: string): T {
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as T;
}

// ---------- AUTH ----------
const DEV_USER: AuthUser = {
  id: 'dev',
  username: 'dev@qldh.local',
  displayName: 'Developer',
  role: 'dev',
  email: 'dev@qldh.local',
};

export class MockAuthRepository implements IAuthRepository {
  async login(input: LoginRequest): Promise<LoginResponse> {
    await delay();
    if (input.role === 'dev') {
      if (input.username !== 'dev@qldh.local' || input.password !== 'dev123') {
        throw new Error('Sai tai khoan dev. Dung: dev@qldh.local / dev123');
      }
      return { token: `mock.${encodeToken(DEV_USER)}`, user: DEV_USER };
    }
    if (input.role === 'student') {
      const sv = db.sinhVien.find((s) => s.MSV === input.username);
      if (!sv) throw new Error(`Khong tim thay sinh vien ${input.username}`);
      if (input.password !== 'student123') throw new Error('Mat khau mac dinh: student123');
      const ttcn = db.ttcn.find((t) => t.CCCD === sv.CCCD);
      const user: AuthUser = {
        id: sv.MSV, username: sv.MSV,
        displayName: `${ttcn?.lastName ?? ''} ${ttcn?.name ?? ''}`.trim() || sv.MSV,
        role: 'student', MSV: sv.MSV,
      };
      return { token: `mock.${encodeToken(user)}`, user };
    }
    // teacher
    const cb = db.canBo.find((c) => c.MCB === input.username);
    if (!cb) throw new Error(`Khong tim thay can bo ${input.username}`);
    if (input.password !== 'teacher123') throw new Error('Mat khau mac dinh: teacher123');
    const ttcn = db.ttcn.find((t) => t.CCCD === cb.CCCD);
    const user: AuthUser = {
      id: cb.MCB, username: cb.MCB,
      displayName: `${ttcn?.lastName ?? ''} ${ttcn?.name ?? ''}`.trim() || cb.MCB,
      role: 'teacher', MCB: cb.MCB,
    };
    return { token: `mock.${encodeToken(user)}`, user };
  }

  async logout(): Promise<void> { await delay(50); }

  async me(): Promise<AuthUser | null> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('qldh:token') : null;
    if (!token?.startsWith('mock.')) return null;
    try { return decodeToken<AuthUser>(token.slice(5)); } catch { return null; }
  }

  async impersonate(targetUserId: string): Promise<LoginResponse> {
    const sv = db.sinhVien.find((s) => s.MSV === targetUserId);
    if (sv) return this.login({ username: sv.MSV, password: 'student123', role: 'student' });
    const cb = db.canBo.find((c) => c.MCB === targetUserId);
    if (cb) return this.login({ username: cb.MCB, password: 'teacher123', role: 'teacher' });
    throw new Error(`Khong tim thay user ${targetUserId}`);
  }
}

// ---------- STUDENT ----------
export class MockStudentRepository implements IStudentRepository {
  async findById(id: string) { await delay(); return db.sinhVien.find((s) => s.MSV === id) ?? null; }
  async list(p?: ListParams): Promise<Page<SinhVien>> { await delay(); return paginate(db.sinhVien, p); }
  async create(input: Partial<SinhVien>): Promise<SinhVien> {
    const sv = input as SinhVien;
    db.sinhVien.push(sv);
    return sv;
  }
  async update(id: string, input: Partial<SinhVien>): Promise<SinhVien> {
    const idx = db.sinhVien.findIndex((s) => s.MSV === id);
    if (idx < 0) throw new Error('Not found');
    db.sinhVien[idx] = { ...db.sinhVien[idx]!, ...input };
    return db.sinhVien[idx]!;
  }
  async delete(id: string): Promise<void> {
    const idx = db.sinhVien.findIndex((s) => s.MSV === id);
    if (idx >= 0) db.sinhVien.splice(idx, 1);
  }
  async getGrades(MSV: string): Promise<BangDiem[]> {
    await delay();
    return db.bangDiem.filter((g) => g.MSV === MSV);
  }
  async getGPA(MSV: string) {
    const sv = db.sinhVien.find((s) => s.MSV === MSV);
    return { GPA: sv?.GPA ?? 0, CPA: sv?.CPA ?? 0 };
  }
  async search(p?: ListParams): Promise<SinhVien[]> {
    const page = await this.list(p);
    return page.items;
  }
}

// ---------- TEACHER ----------
export class MockTeacherRepository implements ITeacherRepository {
  async findById(id: string) { await delay(); return db.canBo.find((c) => c.MCB === id) ?? null; }
  async list(p?: ListParams): Promise<Page<CanBo>> { await delay(); return paginate(db.canBo, p); }
  async create(input: Partial<CanBo>): Promise<CanBo> { db.canBo.push(input as CanBo); return input as CanBo; }
  async update(id: string, input: Partial<CanBo>): Promise<CanBo> {
    const idx = db.canBo.findIndex((c) => c.MCB === id);
    if (idx < 0) throw new Error('Not found');
    db.canBo[idx] = { ...db.canBo[idx]!, ...input };
    return db.canBo[idx]!;
  }
  async delete(id: string): Promise<void> {
    const idx = db.canBo.findIndex((c) => c.MCB === id);
    if (idx >= 0) db.canBo.splice(idx, 1);
  }
  async getTeachingClasses(MCB: string): Promise<LopTinChi[]> {
    await delay();
    return db.lopTinChi.filter((l) => l.MCB === MCB);
  }
}

// ---------- COURSE ----------
export class MockCourseRepository implements ICourseRepository {
  async findById(id: string) { await delay(); return db.mon.find((m) => m.maMon === id) ?? null; }
  async list(p?: ListParams): Promise<Page<Mon>> { await delay(); return paginate(db.mon, p); }
  async create(input: Partial<Mon>): Promise<Mon> { db.mon.push(input as Mon); return input as Mon; }
  async update(id: string, input: Partial<Mon>): Promise<Mon> {
    const idx = db.mon.findIndex((m) => m.maMon === id);
    if (idx < 0) throw new Error('Not found');
    db.mon[idx] = { ...db.mon[idx]!, ...input };
    return db.mon[idx]!;
  }
  async delete(id: string): Promise<void> {
    const idx = db.mon.findIndex((m) => m.maMon === id);
    if (idx >= 0) db.mon.splice(idx, 1);
  }
  async getPrograms(maMon: string): Promise<MonDaoTao[]> {
    return db.monDaoTao.filter((m) => m.maMon === maMon);
  }
  async getPrerequisites(maMon: string, maCT: string, maChuyenNganh: string): Promise<MonTienQuyet[]> {
    return db.monTienQuyet.filter(
      (m) => m.maMon === maMon && m.maCT === maCT && m.maChuyenNganh === maChuyenNganh
    );
  }
  async canRegister(MSV: string, maMon: string, maCT: string, maChuyenNganh: string) {
    const prereqs = await this.getPrerequisites(maMon, maCT, maChuyenNganh);
    const passedSet = new Set(
      db.bangDiem.filter((g) => g.MSV === MSV && (g.diemSo ?? 0) >= 5).map((g) => g.maMon)
    );
    const missing = prereqs.map((p) => p.maTienQuyet).filter((m) => !passedSet.has(m));
    return { ok: missing.length === 0, missing };
  }
}

// ---------- CLASS ----------
function crudFor<T>(items: T[], pkKey: keyof T) {
  return {
    async findById(id: string) { return items.find((i) => String(i[pkKey]) === id) ?? null; },
    async list(p?: ListParams): Promise<Page<T>> { return paginate(items, p); },
    async create(input: Partial<T>) { items.push(input as T); return input as T; },
    async update(id: string, input: Partial<T>) {
      const idx = items.findIndex((i) => String(i[pkKey]) === id);
      if (idx < 0) throw new Error('Not found');
      items[idx] = { ...items[idx]!, ...input };
      return items[idx]!;
    },
    async delete(id: string) {
      const idx = items.findIndex((i) => String(i[pkKey]) === id);
      if (idx >= 0) items.splice(idx, 1);
    },
  };
}

export class MockClassRepository implements IClassRepository {
  creditClasses = crudFor<LopTinChi>(db.lopTinChi, 'maLop');
  adminClasses = crudFor<LopHanhChinh>(db.lopHanhChinh, 'maLop');
  async registerCreditClass(MSV: string, maLop: string): Promise<SinhVien_LopTinChi> {
    await delay();
    if (db.sinhVien_LopTinChi.some((r) => r.MSV === MSV && r.maLop === maLop)) {
      throw new Error('Da dang ky lop nay roi');
    }
    const lop = db.lopTinChi.find((l) => l.maLop === maLop);
    if (!lop) throw new Error('Khong tim thay lop');
    if ((lop.soLuongSinhVien ?? 0) >= (lop.soLuongSinhVienMax ?? 0)) {
      throw new Error('Lop da day');
    }
    lop.soLuongSinhVien = (lop.soLuongSinhVien ?? 0) + 1;
    const reg: SinhVien_LopTinChi = { MSV, maLop, ngayDangKy: new Date().toISOString().slice(0, 10) };
    db.sinhVien_LopTinChi.push(reg);
    return reg;
  }
  async unregisterCreditClass(MSV: string, maLop: string): Promise<void> {
    const idx = db.sinhVien_LopTinChi.findIndex((r) => r.MSV === MSV && r.maLop === maLop);
    if (idx >= 0) {
      db.sinhVien_LopTinChi.splice(idx, 1);
      const lop = db.lopTinChi.find((l) => l.maLop === maLop);
      if (lop && (lop.soLuongSinhVien ?? 0) > 0) lop.soLuongSinhVien = (lop.soLuongSinhVien ?? 0) - 1;
    }
  }
  async listRegistrations(MSV: string): Promise<SinhVien_LopTinChi[]> {
    return db.sinhVien_LopTinChi.filter((r) => r.MSV === MSV);
  }
}

// ---------- GRADE ----------
export class MockGradeRepository implements IGradeRepository {
  async listByStudent(MSV: string): Promise<BangDiem[]> {
    await delay();
    return db.bangDiem.filter((g) => g.MSV === MSV);
  }
  async listByClass(maLop: string): Promise<BangDiem[]> {
    const lop = db.lopTinChi.find((l) => l.maLop === maLop);
    if (!lop) return [];
    const regMSVs = new Set(db.sinhVien_LopTinChi.filter((r) => r.maLop === maLop).map((r) => r.MSV));
    return db.bangDiem.filter((g) => g.maMon === lop.maMon && regMSVs.has(g.MSV));
  }
  async upsert(entry: BangDiem): Promise<BangDiem> {
    const idx = db.bangDiem.findIndex((g) => g.MSV === entry.MSV && g.maMon === entry.maMon);
    if (idx >= 0) db.bangDiem[idx] = entry;
    else db.bangDiem.push(entry);
    return entry;
  }
  async delete(MSV: string, maMon: string): Promise<void> {
    const idx = db.bangDiem.findIndex((g) => g.MSV === MSV && g.maMon === maMon);
    if (idx >= 0) db.bangDiem.splice(idx, 1);
  }
}

// ---------- GENERIC (dev console) ----------
export class MockGenericRepository implements IGenericRepository {
  async list(table: TableName, p?: ListParams): Promise<Page<Record<string, unknown>>> {
    await delay();
    const arr = (db as unknown as Record<string, unknown[]>)[table] ?? [];
    return paginate(arr as Record<string, unknown>[], p);
  }
  async get(table: TableName, pk: Record<string, unknown>): Promise<Record<string, unknown> | null> {
    const arr = (db as unknown as Record<string, Record<string, unknown>[]>)[table] ?? [];
    return arr.find((row) => Object.entries(pk).every(([k, v]) => row[k] === v)) ?? null;
  }
  async create(table: TableName, data: Record<string, unknown>) {
    const arr = (db as unknown as Record<string, Record<string, unknown>[]>)[table];
    if (!arr) throw new Error(`Bang ${table} khong ton tai`);
    arr.push(data);
    return data;
  }
  async update(table: TableName, pk: Record<string, unknown>, data: Record<string, unknown>) {
    const arr = (db as unknown as Record<string, Record<string, unknown>[]>)[table];
    if (!arr) throw new Error(`Bang ${table} khong ton tai`);
    const idx = arr.findIndex((row) => Object.entries(pk).every(([k, v]) => row[k] === v));
    if (idx < 0) throw new Error('Not found');
    arr[idx] = { ...arr[idx]!, ...data };
    return arr[idx]!;
  }
  async delete(table: TableName, pk: Record<string, unknown>) {
    const arr = (db as unknown as Record<string, Record<string, unknown>[]>)[table];
    if (!arr) return;
    const idx = arr.findIndex((row) => Object.entries(pk).every(([k, v]) => row[k] === v));
    if (idx >= 0) arr.splice(idx, 1);
  }
  async resetAndReseed(): Promise<{ ok: true; durationMs: number }> {
    const t0 = performance.now();
    resetDB();
    return { ok: true, durationMs: Math.round(performance.now() - t0) };
  }
}
