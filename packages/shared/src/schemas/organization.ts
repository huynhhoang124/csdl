import { z } from 'zod';
import { IdString, ShortText, LongText, DateOnly } from './_common.js';

export const KhoaSchema = z.object({
  maKhoa: IdString,
  MCB: IdString,
  vanPhongKhoa: ShortText,
  dienThoaiLienHe: ShortText,
  emailLienHe: ShortText,
  moTa: LongText,
  ngayThanhLap: DateOnly,
});
export type Khoa = z.infer<typeof KhoaSchema>;

export const HeDaoTaoSchema = z.object({
  maHe: IdString,
  tenHe: ShortText,
  donVi: ShortText,
  yeuCauDauVao: LongText,
});
export type HeDaoTao = z.infer<typeof HeDaoTaoSchema>;

export const BacSchema = z.object({
  maBac: IdString,
  tenBac: ShortText,
  thoiGianDaoTao: z.number().int().positive().optional().nullable(),
  dieuKien: LongText,
});
export type Bac = z.infer<typeof BacSchema>;
