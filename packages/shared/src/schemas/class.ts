import { z } from 'zod';
import { IdString, ShortText, LongText, DateOnly } from './_common.js';
import { TRANG_THAI_LOP } from '../constants.js';

export const LopHanhChinhSchema = z.object({
  maLop: IdString,
  maHe: IdString,
  maBac: IdString,
  maChuyenNganh: IdString,
  coVanhocTap: IdString,
  siSo: z.number().int().nonnegative().optional().nullable(),
  moTa: LongText,
});
export type LopHanhChinh = z.infer<typeof LopHanhChinhSchema>;

export const LopTinChiSchema = z.object({
  maLop: IdString,
  MCB: IdString,
  maMon: IdString,
  kyDaoTao: z.number().int().optional().nullable(),
  soLuongSinhVienMax: z.number().int().positive().optional().nullable(),
  soLuongSinhVien: z.number().int().nonnegative().optional().nullable(),
  trangThai: z.enum(TRANG_THAI_LOP).optional().nullable(),
});
export type LopTinChi = z.infer<typeof LopTinChiSchema>;

export const SinhVien_LopHanhChinhSchema = z.object({
  MSV: IdString,
  maLop: IdString,
});
export type SinhVien_LopHanhChinh = z.infer<typeof SinhVien_LopHanhChinhSchema>;

export const SinhVien_LopTinChiSchema = z.object({
  MSV: IdString,
  maLop: IdString,
  ngayDangKy: DateOnly,
});
export type SinhVien_LopTinChi = z.infer<typeof SinhVien_LopTinChiSchema>;
