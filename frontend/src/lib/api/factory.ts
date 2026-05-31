import type {
  IAuthRepository,
  IStudentRepository,
  ITeacherRepository,
  ICourseRepository,
  IClassRepository,
  IGradeRepository,
  IGenericRepository,
} from './contracts';
import * as rest from './adapters/rest';

export type BackendMode = 'rest';

export interface RepositoryBundle {
  auth: IAuthRepository;
  student: IStudentRepository;
  teacher: ITeacherRepository;
  course: ICourseRepository;
  class: IClassRepository;
  grade: IGradeRepository;
  generic: IGenericRepository;
}

export function getBackendMode(): BackendMode {
  return 'rest';
}

export function setBackendMode(_mode: BackendMode) {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('qldh:backend-mode');
  }
}

function buildRepositories(): RepositoryBundle {
  return {
    auth: new rest.RestAuthRepository(),
    student: new rest.RestStudentRepository(),
    teacher: new rest.RestTeacherRepository(),
    course: new rest.RestCourseRepository(),
    class: new rest.RestClassRepository(),
    grade: new rest.RestGradeRepository(),
    generic: new rest.RestGenericRepository(),
  };
}

export const repositories: RepositoryBundle = buildRepositories();
