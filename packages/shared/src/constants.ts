export const ROLES = ['student', 'teacher', 'dev'] as const;
export type Role = (typeof ROLES)[number];

export const TRANG_THAI_SINH_VIEN = [
  'Dang hoc',
  'Bao luu',
  'Da tot nghiep',
  'Thoi hoc',
] as const;

export const TRANG_THAI_CAN_BO = [
  'Dang cong tac',
  'Nghi phep',
  'Da nghi huu',
  'Thoi viec',
] as const;

export const KIEU_MON_HOC = ['Bat buoc', 'Tu chon', 'Chuyen nganh'] as const;

export const TRANG_THAI_LOP = ['Sap mo', 'Dang mo', 'Dong', 'Huy'] as const;

export const DIEM_CHU = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'] as const;

export const ALL_TABLES = [
  'ttcn',
  'sinhVien',
  'canBo',
  'Khoa',
  'heDaoTao',
  'bac',
  'chuongTrinhDaoTao',
  'chuyenNganh',
  'mon',
  'monDaoTao',
  'monTienQuyet',
  'bangDiem',
  'lopHanhChinh',
  'lopTinChi',
  'sinhVien_LopHanhChinh',
  'sinhVien_LopTinChi',
  'hocBong',
  'sinhVien_HocBong',
  'nghienCuu',
  'sinhVien_NghienCuu',
  'doAnTN',
  'sinhVien_DoAnTN',
  'duHoc',
  'sinhVien_DuHoc',
  'suKien',
  'sinhVien_SuKien',
] as const;
export type TableName = (typeof ALL_TABLES)[number];
