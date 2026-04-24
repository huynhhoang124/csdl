import { z } from 'zod';
import { IdString, ShortText, LongText, DateOnly, DateTime } from './_common.js';

export const HocBongSchema = z.object({
  maHocBong: IdString,
  tenHocBong: ShortText,
  loaiHocBong: ShortText,
  dieuKien: LongText,
  giaTri: z.number().nonnegative().optional().nullable(),
  moTa: LongText,
  donViCungCap: ShortText,
});
export type HocBong = z.infer<typeof HocBongSchema>;

export const SinhVien_HocBongSchema = z.object({
  MSV: IdString,
  maHocBong: IdString,
  ngayNhan: DateOnly,
  phanTram: z.number().min(0).max(100).optional().nullable(),
});
export type SinhVien_HocBong = z.infer<typeof SinhVien_HocBongSchema>;

export const NghienCuuSchema = z.object({
  maDeTai: IdString,
  tenDeTai: ShortText,
  capDeTai: ShortText,
  phanLoai: ShortText,
  donVi: ShortText,
  kinhPhi: z.number().nonnegative().optional().nullable(),
  thoiGianBatDau: DateOnly,
  thoiGianKetThuc: DateOnly,
  moTa: LongText,
});
export type NghienCuu = z.infer<typeof NghienCuuSchema>;

export const SinhVien_NghienCuuSchema = z.object({
  MSV: IdString,
  maDeTai: IdString,
  vaiTro: ShortText,
  ngayThamGia: DateOnly,
});
export type SinhVien_NghienCuu = z.infer<typeof SinhVien_NghienCuuSchema>;

export const DoAnTNSchema = z.object({
  maDoAn: IdString,
  tenDoAn: ShortText,
  trangThai: ShortText,
  diem: z.number().min(0).max(10).optional().nullable(),
  ngayBatDau: DateOnly,
  ngayBaoVe: DateOnly,
  bacDoAn: ShortText,
  moTa: LongText,
  dinhKem: ShortText,
});
export type DoAnTN = z.infer<typeof DoAnTNSchema>;

export const SinhVien_DoAnTNSchema = z.object({
  MSV: IdString,
  maDoAn: IdString,
  vaiTro: ShortText,
});
export type SinhVien_DoAnTN = z.infer<typeof SinhVien_DoAnTNSchema>;

export const DuHocSchema = z.object({
  maSuat: IdString,
  tenChuongTrinh: ShortText,
  loaiHinh: ShortText,
  hocBong: z.boolean().optional().nullable(),
  donVi: ShortText,
  chuyenNganh: ShortText,
  kinhPhiTaiTro: z.number().nonnegative().optional().nullable(),
  bac: ShortText,
  namBatDau: z.number().int().optional().nullable(),
  namKetThuc: z.number().int().optional().nullable(),
  dieuKien: LongText,
  trangThai: ShortText,
  quocGiaTheoHoc: ShortText,
  donViTheoHoc: ShortText,
  moTa: LongText,
});
export type DuHoc = z.infer<typeof DuHocSchema>;

export const SinhVien_DuHocSchema = z.object({
  MSV: IdString,
  maSuat: IdString,
  trangThai: ShortText,
  ngayDangKy: DateOnly,
});
export type SinhVien_DuHoc = z.infer<typeof SinhVien_DuHocSchema>;

export const SuKienSchema = z.object({
  maSuKien: IdString,
  tenSuKien: ShortText,
  donViToChuc: ShortText,
  soLuongThamGia: z.number().int().nonnegative().optional().nullable(),
  diaDiem: ShortText,
  thoiGianBatDau: DateTime,
  thoiGianKetThuc: DateTime,
  trangThai: ShortText,
  moTa: LongText,
  loaiSuKien: ShortText,
  batBuoc: z.boolean().optional().nullable(),
});
export type SuKien = z.infer<typeof SuKienSchema>;

export const SinhVien_SuKienSchema = z.object({
  MSV: IdString,
  maSuKien: IdString,
  trangThai: ShortText,
});
export type SinhVien_SuKien = z.infer<typeof SinhVien_SuKienSchema>;
