/**
 * REST adapters — gọi Express backend thật qua axios.
 * Endpoints khớp với `backend/src/routes/*`.
 */
import type {
  IAuthRepository, IStudentRepository, ITeacherRepository,
  ICourseRepository, IClassRepository, IGradeRepository, IGenericRepository,
  ListParams, Page,
} from '../../contracts';
import type {
  SinhVien, CanBo, Mon, MonDaoTao, BangDiem,
  LopTinChi, LopHanhChinh, SinhVien_LopTinChi,
  LoginRequest, LoginResponse, AuthUser, TableName,
} from '@qldh/shared';
import { http } from './httpClient';

const notSupported = (m: string) => { throw new Error(`[REST] ${m} chưa được cài ở backend.`); };

export class RestAuthRepository implements IAuthRepository {
  async login(input: LoginRequest): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/auth/login', input);
    return data;
  }
  async logout(): Promise<void> { await http.post('/auth/logout'); }
  async me(): Promise<AuthUser | null> {
    try { const { data } = await http.get<AuthUser>('/auth/me'); return data; }
    catch { return null; }
  }
}

export class RestStudentRepository implements IStudentRepository {
  async findById(id: string) {
    const { data } = await http.get<SinhVien>(`/students/${id}`);
    return data;
  }
  async list(p?: ListParams): Promise<Page<SinhVien>> {
    const { data } = await http.get<Page<SinhVien>>('/admin/tables/sinhVien', { params: p });
    return data;
  }
  async create(): Promise<SinhVien> { return notSupported('student.create') as never; }
  async update(): Promise<SinhVien> { return notSupported('student.update') as never; }
  async delete(): Promise<void> { notSupported('student.delete'); }
  async getGrades(MSV: string): Promise<BangDiem[]> {
    const { data } = await http.get<BangDiem[]>(`/students/${MSV}/grades`);
    return data;
  }
  async getGPA(MSV: string) {
    const { data } = await http.get<{ GPA: number; CPA: number }>(`/students/${MSV}/gpa`);
    return data;
  }
  async search(p?: ListParams): Promise<SinhVien[]> {
    const page = await this.list(p);
    return page.items;
  }
}

export class RestTeacherRepository implements ITeacherRepository {
  async findById(id: string) { const { data } = await http.get<CanBo>(`/teachers/${id}`); return data; }
  async list(p?: ListParams): Promise<Page<CanBo>> {
    const { data } = await http.get<Page<CanBo>>('/admin/tables/canBo', { params: p });
    return data;
  }
  async create(): Promise<CanBo> { return notSupported('teacher.create') as never; }
  async update(): Promise<CanBo> { return notSupported('teacher.update') as never; }
  async delete(): Promise<void> { notSupported('teacher.delete'); }
  async getTeachingClasses(MCB: string): Promise<LopTinChi[]> {
    const { data } = await http.get<LopTinChi[]>(`/teachers/${MCB}/classes`);
    return data;
  }
}

export class RestCourseRepository implements ICourseRepository {
  async findById(id: string) { const { data } = await http.get<Mon>(`/admin/tables/mon`, { params: { search: id } }); return (data as unknown as { items: Mon[] }).items[0] ?? null; }
  async list(p?: ListParams): Promise<Page<Mon>> {
    const { data } = await http.get<Page<Mon>>('/admin/tables/mon', { params: p });
    return data;
  }
  async create(): Promise<Mon> { return notSupported('course.create') as never; }
  async update(): Promise<Mon> { return notSupported('course.update') as never; }
  async delete(): Promise<void> { notSupported('course.delete'); }
  async getPrograms(): Promise<MonDaoTao[]> { return notSupported('course.getPrograms') as never; }
  async canRegister(): Promise<{ ok: boolean; missing: string[] }> { return { ok: true, missing: [] }; }
}

export class RestClassRepository implements IClassRepository {
  creditClasses = {
    async findById(id: string) { const { data } = await http.get<Page<LopTinChi>>('/admin/tables/lopTinChi', { params: { search: id } }); return data.items[0] ?? null; },
    async list(p?: ListParams): Promise<Page<LopTinChi>> {
      const { data } = await http.get<{ items: LopTinChi[] }>('/students/available-classes');
      return { items: data.items, total: data.items.length, page: 1, pageSize: data.items.length };
    },
    async create(): Promise<LopTinChi> { return notSupported('creditClasses.create') as never; },
    async update(): Promise<LopTinChi> { return notSupported('creditClasses.update') as never; },
    async delete(): Promise<void> { notSupported('creditClasses.delete'); },
  };
  adminClasses = {
    async findById(id: string) { const { data } = await http.get<Page<LopHanhChinh>>('/admin/tables/lopHanhChinh', { params: { search: id } }); return data.items[0] ?? null; },
    async list(p?: ListParams): Promise<Page<LopHanhChinh>> { const { data } = await http.get<Page<LopHanhChinh>>('/admin/tables/lopHanhChinh', { params: p }); return data; },
    async create(): Promise<LopHanhChinh> { return notSupported('adminClasses.create') as never; },
    async update(): Promise<LopHanhChinh> { return notSupported('adminClasses.update') as never; },
    async delete(): Promise<void> { notSupported('adminClasses.delete'); },
  };
  async registerCreditClass(msv: string, maLop: string): Promise<SinhVien_LopTinChi> {
    return (await http.post(`/students/${msv}/classes/${maLop}/register`)).data;
  }
  async unregisterCreditClass(msv: string, maLop: string): Promise<void> {
    await http.delete(`/students/${msv}/classes/${maLop}/register`);
  }
  async listRegistrations(msv: string): Promise<SinhVien_LopTinChi[]> { 
    return (await http.get(`/students/${msv}/classes`)).data;
  }
}

export class RestGradeRepository implements IGradeRepository {
  async listByStudent(MSV: string): Promise<BangDiem[]> {
    const { data } = await http.get<BangDiem[]>(`/students/${MSV}/grades`);
    return data;
  }
  async listByClass(): Promise<BangDiem[]> { return []; }
  async upsert(entry: BangDiem): Promise<BangDiem> {
    const { data } = await http.post<BangDiem>('/teachers/grades', entry);
    return data;
  }
  async delete(): Promise<void> { notSupported('grade.delete'); }
}

export class RestGenericRepository implements IGenericRepository {
  async list(table: TableName, p?: ListParams): Promise<Page<Record<string, unknown>>> {
    const { data } = await http.get<Page<Record<string, unknown>>>(`/admin/tables/${table}`, { params: p });
    return data;
  }
  async get(table: TableName, pk: Record<string, unknown>) {
    const page = await this.list(table, { search: String(Object.values(pk)[0] ?? '') });
    return page.items[0] ?? null;
  }
  async create(table: TableName, data: Record<string, unknown>) {
    const { data: r } = await http.post<Record<string, unknown>>(`/admin/tables/${table}`, data);
    return r;
  }
  async update(table: TableName, pk: Record<string, unknown>, data: Record<string, unknown>) {
    const { data: r } = await http.put<Record<string, unknown>>(`/admin/tables/${table}`, { pk, data });
    return r;
  }
  async delete(table: TableName, pk: Record<string, unknown>) {
    await http.delete(`/admin/tables/${table}`, { data: pk });
  }
  async upsert(table: TableName, data: Record<string, unknown>) {
    const { data: r } = await http.post<Record<string, unknown>>(`/admin/tables/${table}/upsert`, data);
    return r;
  }
  async resetAndReseed(): Promise<{ ok: true; durationMs: number }> {
    return { ok: true, durationMs: 0 };
  }
  async rest(path: string): Promise<any> {
    const { data } = await http.get(path);
    return data;
  }
}
