import type { LopTinChi, LopHanhChinh, SinhVien_LopTinChi } from '@qldh/shared';
import type { ICrudRepository, ListParams } from './common';

export interface IClassRepository {
  creditClasses: ICrudRepository<LopTinChi, string>;
  adminClasses: ICrudRepository<LopHanhChinh, string>;
  registerCreditClass(MSV: string, maLop: string): Promise<SinhVien_LopTinChi>;
  unregisterCreditClass(MSV: string, maLop: string): Promise<void>;
  listRegistrations(MSV: string, params?: ListParams): Promise<SinhVien_LopTinChi[]>;
}
