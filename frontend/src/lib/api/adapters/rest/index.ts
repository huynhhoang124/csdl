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

const notSupported = (m: string) => {
  throw new Error(`[REST] ${m} is not supported by the Luan backend.`);
};
const adminTables = (table: TableName) => `/admin/tables/${table}`;
const pageFromItems = <T>(items: T[], p?: ListParams): Page<T> => ({
  items,
  total: items.length,
  page: p?.page ?? 1,
  pageSize: p?.pageSize ?? items.length,
});

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
    const { data } = await http.get<Page<SinhVien>>(adminTables('sinhVien'), { params: p });
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
  async findById(id: string) {
    const { data } = await http.get<CanBo>(`/teachers/${id}`);
    return data;
  }
  async list(p?: ListParams): Promise<Page<CanBo>> {
    const { data } = await http.get<Page<CanBo>>(adminTables('canBo'), { params: p });
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
  async findById(id: string) {
    const { data } = await http.get<Page<Mon>>(adminTables('mon'), { params: { search: id } });
    return data.items[0] ?? null;
  }
  async list(p?: ListParams): Promise<Page<Mon>> {
    const { data } = await http.get<Page<Mon>>(adminTables('mon'), { params: p });
    return data;
  }
  async create(): Promise<Mon> { return notSupported('course.create') as never; }
  async update(): Promise<Mon> { return notSupported('course.update') as never; }
  async delete(): Promise<void> { notSupported('course.delete'); }
  async getPrograms(): Promise<MonDaoTao[]> { return notSupported('course.getPrograms') as never; }
  async getPrerequisites(): Promise<Record<string, unknown>[]> { return notSupported('course.getPrerequisites') as never; }
  async canRegister(): Promise<{ ok: boolean; missing: string[] }> { return notSupported('course.canRegister') as never; }
}

export class RestClassRepository implements IClassRepository {
  creditClasses = {
    async findById(id: string) {
      const { data } = await http.get<{ items: LopTinChi[] }>('/students/available-classes');
      return data.items.find((item) => item.maLop === id) ?? null;
    },
    async list(p?: ListParams): Promise<Page<LopTinChi>> {
      const { data } = await http.get<{ items: LopTinChi[] }>('/students/available-classes');
      const items = p?.search
        ? data.items.filter((item) => Object.values(item).some((value) => String(value ?? '').includes(p.search!)))
        : data.items;
      return pageFromItems(items, p);
    },
    async create(): Promise<LopTinChi> { return notSupported('creditClasses.create') as never; },
    async update(): Promise<LopTinChi> { return notSupported('creditClasses.update') as never; },
    async delete(): Promise<void> { notSupported('creditClasses.delete'); },
  };
  adminClasses = {
    async findById(id: string) {
      const { data } = await http.get<Page<LopHanhChinh>>(adminTables('lopHanhChinh'), { params: { search: id } });
      return data.items[0] ?? null;
    },
    async list(p?: ListParams): Promise<Page<LopHanhChinh>> {
      const { data } = await http.get<Page<LopHanhChinh>>(adminTables('lopHanhChinh'), { params: p });
      return data;
    },
    async create(): Promise<LopHanhChinh> { return notSupported('adminClasses.create') as never; },
    async update(): Promise<LopHanhChinh> { return notSupported('adminClasses.update') as never; },
    async delete(): Promise<void> { notSupported('adminClasses.delete'); },
  };
  async registerCreditClass(MSV: string, maLop: string): Promise<SinhVien_LopTinChi> {
    const { data } = await http.post<SinhVien_LopTinChi>(`/students/${MSV}/classes/${maLop}/register`);
    return data;
  }
  async unregisterCreditClass(MSV: string, maLop: string): Promise<void> {
    await http.delete(`/students/${MSV}/classes/${maLop}/register`);
  }
  async listRegistrations(MSV: string): Promise<SinhVien_LopTinChi[]> {
    const { data } = await http.get<SinhVien_LopTinChi[]>(`/students/${MSV}/classes`);
    return data;
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
    const { data } = await http.get<Page<Record<string, unknown>>>(adminTables(table), { params: p });
    return data;
  }
  async get(table: TableName, pk: Record<string, unknown>) {
    const page = await this.list(table, { search: String(Object.values(pk)[0] ?? '') });
    return page.items[0] ?? null;
  }
  async create(table: TableName, data: Record<string, unknown>) {
    const { data: r } = await http.post<Record<string, unknown>>(adminTables(table), data);
    return r;
  }
  async update(table: TableName, pk: Record<string, unknown>, data: Record<string, unknown>) {
    const { data: r } = await http.put<Record<string, unknown>>(adminTables(table), { pk, data });
    return r;
  }
  async upsert(table: TableName, data: Record<string, unknown>) {
    const { data: r } = await http.post<Record<string, unknown>>(`${adminTables(table)}/upsert`, data);
    return r;
  }
  async delete(table: TableName, pk: Record<string, unknown>) {
    await http.delete(adminTables(table), { data: pk });
  }
  async resetAndReseed() {
    return notSupported('resetAndReseed') as never;
  }
  async rest(path: string) {
    const { data } = await http.get(path);
    return data;
  }
}
