import { z } from 'zod';
import { IdString, ShortText, LongText } from './_common.js';

export const ChuongTrinhDaoTaoSchema = z.object({
  maCT: IdString,
  tenCT: ShortText,
  tenDonVi: ShortText,
  giamDoc: ShortText,
});
export type ChuongTrinhDaoTao = z.infer<typeof ChuongTrinhDaoTaoSchema>;

export const ChuyenNganhSchema = z.object({
  maChuyenNganh: IdString,
  maKhoa: IdString,
  maHe: IdString,
  maBac: IdString,
  tenChuyenNganh: ShortText,
  soTinChi: z.number().int().positive().optional().nullable(),
  bangCap: ShortText,
  dieuKien: LongText,
});
export type ChuyenNganh = z.infer<typeof ChuyenNganhSchema>;
