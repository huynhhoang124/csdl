import type { BangDiem } from '@qldh/shared';
import type { ListParams } from './common';

export interface IGradeRepository {
  listByStudent(MSV: string, params?: ListParams): Promise<BangDiem[]>;
  listByClass(maLop: string): Promise<BangDiem[]>;
  upsert(entry: BangDiem): Promise<BangDiem>;
  delete(MSV: string, maMon: string): Promise<void>;
}
