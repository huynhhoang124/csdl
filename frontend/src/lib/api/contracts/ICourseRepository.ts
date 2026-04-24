import type { Mon, MonDaoTao, MonTienQuyet } from '@qldh/shared';
import type { ICrudRepository } from './common';

export interface ICourseRepository extends ICrudRepository<Mon, string> {
  getPrograms(maMon: string): Promise<MonDaoTao[]>;
  getPrerequisites(maMon: string, maCT: string, maChuyenNganh: string): Promise<MonTienQuyet[]>;
  /** Kiểm tra SV đã đủ điều kiện tiên quyết để đăng ký 1 môn */
  canRegister(MSV: string, maMon: string, maCT: string, maChuyenNganh: string): Promise<{
    ok: boolean;
    missing: string[];
  }>;
}
