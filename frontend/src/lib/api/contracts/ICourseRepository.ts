import type { Mon, MonDaoTao } from '@qldh/shared';
import type { ICrudRepository } from './common';

export interface ICourseRepository extends ICrudRepository<Mon, string> {
  getPrograms(maMon: string): Promise<MonDaoTao[]>;
  /** Kiểm tra SV đã đủ điều kiện để đăng ký 1 môn */
  canRegister(MSV: string, maMon: string, maCT: string, maChuyenNganh: string): Promise<{
    ok: boolean;
    missing: string[];
  }>;
}
