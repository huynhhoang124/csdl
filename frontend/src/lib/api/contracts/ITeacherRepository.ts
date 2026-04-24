import type { CanBo, LopTinChi } from '@qldh/shared';
import type { ICrudRepository } from './common';

export interface ITeacherRepository extends ICrudRepository<CanBo, string> {
  getTeachingClasses(MCB: string): Promise<LopTinChi[]>;
}
