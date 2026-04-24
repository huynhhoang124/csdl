/**
 * FACTORY — heart of pluggable architecture.
 * Chọn adapter backend theo env `VITE_BACKEND_MODE` hoặc runtime override (localStorage).
 *
 * Thêm backend mới (VD Supabase/GraphQL/Firebase):
 *   1. Tạo thư mục `adapters/<name>/` implement các interface `contracts/*`.
 *   2. Import + đăng ký ở `buildRepositories` bên dưới.
 *   3. KHÔNG sửa bất kỳ component/page nào.
 */
import type {
  IAuthRepository,
  IStudentRepository,
  ITeacherRepository,
  ICourseRepository,
  IClassRepository,
  IGradeRepository,
  IGenericRepository,
} from './contracts';
import * as mock from './adapters/mock';
import * as rest from './adapters/rest';

export type BackendMode = 'mock' | 'rest' | 'graphql' | 'supabase';

export interface RepositoryBundle {
  auth: IAuthRepository;
  student: IStudentRepository;
  teacher: ITeacherRepository;
  course: ICourseRepository;
  class: IClassRepository;
  grade: IGradeRepository;
  generic: IGenericRepository;
}

const LS_KEY = 'qldh:backend-mode';

export function getBackendMode(): BackendMode {
  if (typeof window !== 'undefined') {
    const fromLs = window.localStorage.getItem(LS_KEY) as BackendMode | null;
    if (fromLs) return fromLs;
  }
  const fromEnv = (import.meta.env.VITE_BACKEND_MODE ?? 'mock') as BackendMode;
  return fromEnv;
}

export function setBackendMode(mode: BackendMode) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LS_KEY, mode);
    window.location.reload();
  }
}

function buildRepositories(mode: BackendMode): RepositoryBundle {
  switch (mode) {
    case 'rest':
      return {
        auth: new rest.RestAuthRepository(),
        student: new rest.RestStudentRepository(),
        teacher: new rest.RestTeacherRepository(),
        course: new rest.RestCourseRepository(),
        class: new rest.RestClassRepository(),
        grade: new rest.RestGradeRepository(),
        generic: new rest.RestGenericRepository(),
      };
    case 'mock':
    default:
      return {
        auth: new mock.MockAuthRepository(),
        student: new mock.MockStudentRepository(),
        teacher: new mock.MockTeacherRepository(),
        course: new mock.MockCourseRepository(),
        class: new mock.MockClassRepository(),
        grade: new mock.MockGradeRepository(),
        generic: new mock.MockGenericRepository(),
      };
  }
}

export const repositories: RepositoryBundle = buildRepositories(getBackendMode());
