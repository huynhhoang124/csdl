/**
 * Registry map TableName → Zod schema + primary key fields.
 * Dùng cho Dev Console CRUD form động.
 */
import * as S from '@qldh/shared';
import type { TableName } from '@qldh/shared';
import type { ZodObject, ZodTypeAny } from 'zod';

export interface TableMeta {
  schema: ZodObject<Record<string, ZodTypeAny>>;
  primaryKeys: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SCHEMA_REGISTRY: Record<TableName, TableMeta> = {
  ttcn: { schema: S.TtcnSchema as any, primaryKeys: ['CCCD'] },
  sinhVien: { schema: S.SinhVienSchema as any, primaryKeys: ['MSV'] },
  canBo: { schema: S.CanBoSchema as any, primaryKeys: ['MCB'] },
  Khoa: { schema: S.KhoaSchema as any, primaryKeys: ['maKhoa'] },
  heDaoTao: { schema: S.HeDaoTaoSchema as any, primaryKeys: ['maHe'] },
  bac: { schema: S.BacSchema as any, primaryKeys: ['maBac'] },
  chuongTrinhDaoTao: { schema: S.ChuongTrinhDaoTaoSchema as any, primaryKeys: ['maCT'] },
  chuyenNganh: { schema: S.ChuyenNganhSchema as any, primaryKeys: ['maChuyenNganh'] },
  mon: { schema: S.MonSchema as any, primaryKeys: ['maMon'] },
  monDaoTao: { schema: S.MonDaoTaoSchema as any, primaryKeys: ['maCT', 'maMon', 'maChuyenNganh'] },
  monTienQuyet: { schema: S.MonTienQuyetSchema as any, primaryKeys: ['maCT', 'maMon', 'maChuyenNganh', 'maTienQuyet'] },
  bangDiem: { schema: S.BangDiemSchema as any, primaryKeys: ['maMon', 'MSV'] },
  lopHanhChinh: { schema: S.LopHanhChinhSchema as any, primaryKeys: ['maLop'] },
  lopTinChi: { schema: S.LopTinChiSchema as any, primaryKeys: ['maLop'] },
  sinhVien_LopHanhChinh: { schema: S.SinhVien_LopHanhChinhSchema as any, primaryKeys: ['MSV', 'maLop'] },
  sinhVien_LopTinChi: { schema: S.SinhVien_LopTinChiSchema as any, primaryKeys: ['MSV', 'maLop'] },
  hocBong: { schema: S.HocBongSchema as any, primaryKeys: ['maHocBong'] },
  sinhVien_HocBong: { schema: S.SinhVien_HocBongSchema as any, primaryKeys: ['MSV', 'maHocBong'] },
  nghienCuu: { schema: S.NghienCuuSchema as any, primaryKeys: ['maDeTai'] },
  sinhVien_NghienCuu: { schema: S.SinhVien_NghienCuuSchema as any, primaryKeys: ['MSV', 'maDeTai'] },
  doAnTN: { schema: S.DoAnTNSchema as any, primaryKeys: ['maDoAn'] },
  sinhVien_DoAnTN: { schema: S.SinhVien_DoAnTNSchema as any, primaryKeys: ['MSV', 'maDoAn'] },
  duHoc: { schema: S.DuHocSchema as any, primaryKeys: ['maSuat'] },
  sinhVien_DuHoc: { schema: S.SinhVien_DuHocSchema as any, primaryKeys: ['MSV', 'maSuat'] },
  suKien: { schema: S.SuKienSchema as any, primaryKeys: ['maSuKien'] },
  sinhVien_SuKien: { schema: S.SinhVien_SuKienSchema as any, primaryKeys: ['MSV', 'maSuKien'] },
};
