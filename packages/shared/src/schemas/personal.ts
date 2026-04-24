import { z } from 'zod';
import { IdString, ShortText, LongText, DateOnly } from './_common.js';
import { TRANG_THAI_SINH_VIEN, TRANG_THAI_CAN_BO } from '../constants.js';

export const TtcnSchema = z.object({
  CCCD: IdString,
  lastName: ShortText,
  name: ShortText,
  ngaySinh: DateOnly,
  gioiTinh: ShortText,
  soDienThoai: ShortText,
  ngayCapCCCD: DateOnly,
  diaChiThuongTru: LongText,
  diaChiTamTru: LongText,
  quocTich: ShortText,
  danToc: ShortText,
  congGiao: ShortText,
  baoHiem: ShortText,
});
export type Ttcn = z.infer<typeof TtcnSchema>;

export const SinhVienSchema = z.object({
  MSV: IdString,
  CCCD: IdString,
  trangThai: z.enum(TRANG_THAI_SINH_VIEN).optional().nullable(),
  namHoc: z.number().int().min(1900).max(2100).optional().nullable(),
  khoaDaoTao: ShortText,
  tenNganHang: ShortText,
  soTaiKhoan: ShortText,
  GPA: z.number().min(0).max(4).optional().nullable(),
  CPA: z.number().min(0).max(4).optional().nullable(),
});
export type SinhVien = z.infer<typeof SinhVienSchema>;

export const CanBoSchema = z.object({
  MCB: IdString,
  CCCD: IdString,
  viTriCongViec: ShortText,
  trangThai: z.enum(TRANG_THAI_CAN_BO).optional().nullable(),
});
export type CanBo = z.infer<typeof CanBoSchema>;
