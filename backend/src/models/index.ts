/**
 * Sequelize models cho 26 bảng.
 * Dùng `sequelize.define` thay vì decorator để đơn giản + map 1-1 với migration.
 */
import { DataTypes, type ModelStatic, type Model } from 'sequelize';
import { sequelize } from '../db.js';
import type { TableName } from '@qldh/shared';

const idCol = { type: DataTypes.STRING(50), allowNull: false };
const strCol = { type: DataTypes.STRING(255) };
const txtCol = { type: DataTypes.TEXT };

const common = { timestamps: false, freezeTableName: true };

export const Ttcn = sequelize.define('ttcn', {
  CCCD: { ...idCol, primaryKey: true },
  lastName: strCol, name: strCol,
  ngaySinh: DataTypes.DATEONLY, gioiTinh: strCol,
  soDienThoai: strCol, ngayCapCCCD: DataTypes.DATEONLY,
  diaChiThuongTru: txtCol, diaChiTamTru: txtCol,
  quocTich: strCol, danToc: strCol, congGiao: strCol, baoHiem: strCol,
}, common);

export const SinhVien = sequelize.define('sinhVien', {
  MSV: { ...idCol, primaryKey: true }, CCCD: idCol,
  trangThai: strCol, namHoc: DataTypes.INTEGER,
  khoaDaoTao: strCol, tenNganHang: strCol, soTaiKhoan: strCol,
  GPA: DataTypes.FLOAT, CPA: DataTypes.FLOAT,
}, common);

export const CanBo = sequelize.define('canBo', {
  MCB: { ...idCol, primaryKey: true }, CCCD: idCol,
  viTriCongViec: strCol, trangThai: strCol,
}, common);

export const Khoa = sequelize.define('Khoa', {
  maKhoa: { ...idCol, primaryKey: true }, MCB: idCol,
  vanPhongKhoa: strCol, dienThoaiLienHe: strCol, emailLienHe: strCol,
  moTa: txtCol, ngayThanhLap: DataTypes.DATEONLY,
}, common);

export const HeDaoTao = sequelize.define('heDaoTao', {
  maHe: { ...idCol, primaryKey: true }, tenHe: strCol, donVi: strCol, yeuCauDauVao: txtCol,
}, common);

export const Bac = sequelize.define('bac', {
  maBac: { ...idCol, primaryKey: true }, tenBac: strCol,
  thoiGianDaoTao: DataTypes.INTEGER, dieuKien: txtCol,
}, common);

export const ChuongTrinhDaoTao = sequelize.define('chuongTrinhDaoTao', {
  maCT: { ...idCol, primaryKey: true }, tenCT: strCol, tenDonVi: strCol, giamDoc: strCol,
}, common);

export const ChuyenNganh = sequelize.define('chuyenNganh', {
  maChuyenNganh: { ...idCol, primaryKey: true },
  maKhoa: idCol, maHe: idCol, maBac: idCol,
  tenChuyenNganh: strCol, soTinChi: DataTypes.INTEGER, bangCap: strCol, dieuKien: txtCol,
}, common);

export const Mon = sequelize.define('mon', {
  maMon: { ...idCol, primaryKey: true }, maKhoa: idCol,
  tenMon: strCol, kieuMonHoc: strCol, moTa: txtCol,
}, common);

export const MonDaoTao = sequelize.define('monDaoTao', {
  maCT: { ...idCol, primaryKey: true },
  maMon: { ...idCol, primaryKey: true },
  maChuyenNganh: { ...idCol, primaryKey: true },
  soTinChi: DataTypes.INTEGER,
  soTietLyThuyet: DataTypes.INTEGER, soTietThucHanh: DataTypes.INTEGER,
  hocPhi: DataTypes.DECIMAL(18, 2),
}, common);

export const MonTienQuyet = sequelize.define('monTienQuyet', {
  maCT: { ...idCol, primaryKey: true },
  maMon: { ...idCol, primaryKey: true },
  maChuyenNganh: { ...idCol, primaryKey: true },
  maTienQuyet: { ...idCol, primaryKey: true },
  moTa: txtCol,
}, common);

export const BangDiem = sequelize.define('bangDiem', {
  maMon: { ...idCol, primaryKey: true },
  MSV: { ...idCol, primaryKey: true },
  diemSo: DataTypes.FLOAT, diemChu: strCol,
}, common);

export const LopHanhChinh = sequelize.define('lopHanhChinh', {
  maLop: { ...idCol, primaryKey: true },
  maHe: idCol, maBac: idCol, maChuyenNganh: idCol, coVanhocTap: idCol,
  siSo: DataTypes.INTEGER, moTa: txtCol,
}, common);

export const LopTinChi = sequelize.define('lopTinChi', {
  maLop: { ...idCol, primaryKey: true }, MCB: idCol, maMon: idCol,
  kyDaoTao: DataTypes.INTEGER,
  soLuongSinhVienMax: DataTypes.INTEGER,
  soLuongSinhVien: DataTypes.INTEGER, trangThai: strCol,
}, common);

export const SinhVien_LopHanhChinh = sequelize.define('sinhVien_LopHanhChinh', {
  MSV: { ...idCol, primaryKey: true }, maLop: { ...idCol, primaryKey: true },
}, common);

export const SinhVien_LopTinChi = sequelize.define('sinhVien_LopTinChi', {
  MSV: { ...idCol, primaryKey: true }, maLop: { ...idCol, primaryKey: true },
  ngayDangKy: DataTypes.DATEONLY,
}, common);

export const HocBong = sequelize.define('hocBong', {
  maHocBong: { ...idCol, primaryKey: true },
  tenHocBong: strCol, loaiHocBong: strCol, dieuKien: txtCol,
  giaTri: DataTypes.DECIMAL(18, 2), moTa: txtCol, donViCungCap: strCol,
}, common);

export const SinhVien_HocBong = sequelize.define('sinhVien_HocBong', {
  MSV: { ...idCol, primaryKey: true }, maHocBong: { ...idCol, primaryKey: true },
  ngayNhan: DataTypes.DATEONLY, phanTram: DataTypes.DECIMAL(5, 2),
}, common);

export const NghienCuu = sequelize.define('nghienCuu', {
  maDeTai: { ...idCol, primaryKey: true },
  tenDeTai: strCol, capDeTai: strCol, phanLoai: strCol, donVi: strCol,
  kinhPhi: DataTypes.DECIMAL(18, 2),
  thoiGianBatDau: DataTypes.DATEONLY, thoiGianKetThuc: DataTypes.DATEONLY, moTa: txtCol,
}, common);

export const SinhVien_NghienCuu = sequelize.define('sinhVien_NghienCuu', {
  MSV: { ...idCol, primaryKey: true }, maDeTai: { ...idCol, primaryKey: true },
  vaiTro: strCol, ngayThamGia: DataTypes.DATEONLY,
}, common);

export const DoAnTN = sequelize.define('doAnTN', {
  maDoAn: { ...idCol, primaryKey: true },
  tenDoAn: strCol, trangThai: strCol, diem: DataTypes.FLOAT,
  ngayBatDau: DataTypes.DATEONLY, ngayBaoVe: DataTypes.DATEONLY,
  bacDoAn: strCol, moTa: txtCol, dinhKem: strCol,
}, common);

export const SinhVien_DoAnTN = sequelize.define('sinhVien_DoAnTN', {
  MSV: { ...idCol, primaryKey: true }, maDoAn: { ...idCol, primaryKey: true }, vaiTro: strCol,
}, common);

export const DuHoc = sequelize.define('duHoc', {
  maSuat: { ...idCol, primaryKey: true },
  tenChuongTrinh: strCol, loaiHinh: strCol, hocBong: DataTypes.BOOLEAN,
  donVi: strCol, chuyenNganh: strCol, kinhPhiTaiTro: DataTypes.DECIMAL(18, 2),
  bac: strCol, namBatDau: DataTypes.INTEGER, namKetThuc: DataTypes.INTEGER,
  dieuKien: txtCol, trangThai: strCol,
  quocGiaTheoHoc: strCol, donViTheoHoc: strCol, moTa: txtCol,
}, common);

export const SinhVien_DuHoc = sequelize.define('sinhVien_DuHoc', {
  MSV: { ...idCol, primaryKey: true }, maSuat: { ...idCol, primaryKey: true },
  trangThai: strCol, ngayDangKy: DataTypes.DATEONLY,
}, common);

export const SuKien = sequelize.define('suKien', {
  maSuKien: { ...idCol, primaryKey: true },
  tenSuKien: strCol, donViToChuc: strCol, soLuongThamGia: DataTypes.INTEGER,
  diaDiem: strCol, thoiGianBatDau: DataTypes.DATE, thoiGianKetThuc: DataTypes.DATE,
  trangThai: strCol, moTa: txtCol, loaiSuKien: strCol, batBuoc: DataTypes.BOOLEAN,
}, common);

export const SinhVien_SuKien = sequelize.define('sinhVien_SuKien', {
  MSV: { ...idCol, primaryKey: true }, maSuKien: { ...idCol, primaryKey: true }, trangThai: strCol,
}, common);

export const MODELS: Record<TableName, ModelStatic<Model>> = {
  ttcn: Ttcn, sinhVien: SinhVien, canBo: CanBo, Khoa,
  heDaoTao: HeDaoTao, bac: Bac, chuongTrinhDaoTao: ChuongTrinhDaoTao, chuyenNganh: ChuyenNganh,
  mon: Mon, monDaoTao: MonDaoTao, monTienQuyet: MonTienQuyet, bangDiem: BangDiem,
  lopHanhChinh: LopHanhChinh, lopTinChi: LopTinChi,
  sinhVien_LopHanhChinh: SinhVien_LopHanhChinh, sinhVien_LopTinChi: SinhVien_LopTinChi,
  hocBong: HocBong, sinhVien_HocBong: SinhVien_HocBong,
  nghienCuu: NghienCuu, sinhVien_NghienCuu: SinhVien_NghienCuu,
  doAnTN: DoAnTN, sinhVien_DoAnTN: SinhVien_DoAnTN,
  duHoc: DuHoc, sinhVien_DuHoc: SinhVien_DuHoc,
  suKien: SuKien, sinhVien_SuKien: SinhVien_SuKien,
};
