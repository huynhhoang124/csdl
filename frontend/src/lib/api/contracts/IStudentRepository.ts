import type { SinhVien, BangDiem } from '@qldh/shared';
import type { ICrudRepository, ListParams } from './common';

export interface IStudentRepository extends ICrudRepository<SinhVien, string> {
  getGrades(MSV: string): Promise<BangDiem[]>;
  getGPA(MSV: string): Promise<{ GPA: number; CPA: number }>;
  search(params?: ListParams): Promise<SinhVien[]>;
}
