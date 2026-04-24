import { z } from 'zod';
import { IdString, ShortText, LongText } from './_common.js';
import { KIEU_MON_HOC, DIEM_CHU } from '../constants.js';

export const MonSchema = z.object({
  maMon: IdString,
  maKhoa: IdString,
  tenMon: ShortText,
  kieuMonHoc: z.enum(KIEU_MON_HOC).optional().nullable(),
  moTa: LongText,
});
export type Mon = z.infer<typeof MonSchema>;

export const MonDaoTaoSchema = z.object({
  maCT: IdString,
  maMon: IdString,
  maChuyenNganh: IdString,
  soTinChi: z.number().int().positive().optional().nullable(),
  soTietLyThuyet: z.number().int().nonnegative().optional().nullable(),
  soTietThucHanh: z.number().int().nonnegative().optional().nullable(),
  hocPhi: z.number().nonnegative().optional().nullable(),
});
export type MonDaoTao = z.infer<typeof MonDaoTaoSchema>;

export const MonTienQuyetSchema = z.object({
  maCT: IdString,
  maMon: IdString,
  maChuyenNganh: IdString,
  maTienQuyet: IdString,
  moTa: LongText,
});
export type MonTienQuyet = z.infer<typeof MonTienQuyetSchema>;

export const BangDiemSchema = z.object({
  maMon: IdString,
  MSV: IdString,
  diemSo: z.number().min(0).max(10).optional().nullable(),
  diemChu: z.enum(DIEM_CHU).optional().nullable(),
});
export type BangDiem = z.infer<typeof BangDiemSchema>;
