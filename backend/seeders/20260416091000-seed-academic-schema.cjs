'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const bcrypt = require('bcryptjs');
    const studentHash = bcrypt.hashSync('student123', 8);
    const teacherHash = bcrypt.hashSync('teacher123', 8);
    const adminHash = bcrypt.hashSync('admin123', 8);

    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkInsert('ttcn', [
        { CCCD: '001001001001', Ho: 'Nguyen', Ten: 'An', vaiTro: 'Sinh vien', matKhau: studentHash, ngaySinh: '2005-01-15', gioiTinh: 'Nam', soDienThoai: '0901000001', ngayCapCCCD: '2023-01-10', diaChiThuongTru: 'Ha Noi', diaChiTamTru: 'KTX A', quocTich: 'Viet Nam', danToc: 'Kinh', congGiao: 'Khong', baoHiem: 'BHYT001' },
        { CCCD: '001001001002', Ho: 'Tran', Ten: 'Binh', vaiTro: 'Sinh vien', matKhau: studentHash, ngaySinh: '2005-03-22', gioiTinh: 'Nu', soDienThoai: '0901000002', ngayCapCCCD: '2023-02-15', diaChiThuongTru: 'Hai Phong', diaChiTamTru: 'KTX B', quocTich: 'Viet Nam', danToc: 'Kinh', congGiao: 'Khong', baoHiem: 'BHYT002' },
        { CCCD: '001001001003', Ho: 'Pham', Ten: 'Cuong', vaiTro: 'Giang vien', matKhau: teacherHash, ngaySinh: '1985-06-10', gioiTinh: 'Nam', soDienThoai: '0901000003', ngayCapCCCD: '2021-04-12', diaChiThuongTru: 'Nam Dinh', diaChiTamTru: 'Ha Noi', quocTich: 'Viet Nam', danToc: 'Kinh', congGiao: 'Khong', baoHiem: 'BHYT003' },
        { CCCD: '001001001004', Ho: 'Le', Ten: 'Dung', vaiTro: 'Giang vien', matKhau: teacherHash, ngaySinh: '1988-09-05', gioiTinh: 'Nu', soDienThoai: '0901000004', ngayCapCCCD: '2021-05-20', diaChiThuongTru: 'Thai Binh', diaChiTamTru: 'Ha Noi', quocTich: 'Viet Nam', danToc: 'Kinh', congGiao: 'Khong', baoHiem: 'BHYT004' },
        { CCCD: '001001001005', Ho: 'Vo', Ten: 'Admin', vaiTro: 'Admin', matKhau: adminHash, ngaySinh: '1980-01-01', gioiTinh: 'Nam', soDienThoai: '0901000005', ngayCapCCCD: '2020-01-01', diaChiThuongTru: 'Ha Noi', diaChiTamTru: 'Ha Noi', quocTich: 'Viet Nam', danToc: 'Kinh', congGiao: 'Khong', baoHiem: 'BHYT005' },
      ], { transaction: t });

      await queryInterface.bulkInsert('Khoa', [
        { maKhoa: 'CNTT', vanPhongKhoa: 'Tang 3 toa A1', dienThoaiLienHe: '02473001234', emailLienHe: 'cntt@university.edu.vn', moTa: 'Khoa CNTT', ngayThanhLap: '2000-09-01' },
      ], { transaction: t });

      await queryInterface.bulkInsert('canBo', [
        { MCB: 'CB001', CCCD: '001001001003', maKhoa: 'CNTT', viTriCongViec: 'Truong khoa', trangThai: 'Dang cong tac' },
        { MCB: 'CB002', CCCD: '001001001004', maKhoa: 'CNTT', viTriCongViec: 'Giang vien', trangThai: 'Dang cong tac' },
        { MCB: 'ADMIN01', CCCD: '001001001005', maKhoa: 'CNTT', viTriCongViec: 'Admin', trangThai: 'Dang cong tac' },
      ], { transaction: t });

      await queryInterface.bulkInsert('sinhVien', [
        { MSV: 'SV001', CCCD: '001001001001', maKhoa: 'CNTT', trangThai: 'Dang hoc', namHoc: 2023, khoaDaoTao: '2023-2027', tenNganHang: 'VCB', soTaiKhoan: '190010000001', GPA: 3.45, CPA: 3.4 },
        { MSV: 'SV002', CCCD: '001001001002', maKhoa: 'CNTT', trangThai: 'Dang hoc', namHoc: 2023, khoaDaoTao: '2023-2027', tenNganHang: 'BIDV', soTaiKhoan: '190010000002', GPA: 3.68, CPA: 3.61 },
      ], { transaction: t });

      await queryInterface.bulkInsert('heDaoTao', [
        { maHe: 'CQ', tenHe: 'Chinh quy', donVi: 'Truong Dai hoc', yeuCauDauVao: 'Tot nghiep THPT' },
      ], { transaction: t });

      await queryInterface.bulkInsert('bac', [
        { maBac: 'DH', tenBac: 'Dai hoc', thoiGianDaoTao: 4, dieuKien: 'Toi thieu 130 tin chi' },
      ], { transaction: t });

      await queryInterface.bulkInsert('chuongTrinhDaoTao', [
        { maCT: 'CTCNTT', tenCT: 'Chuong trinh CNTT', tenDonVi: 'Khoa CNTT', giamDoc: 'CB001' },
      ], { transaction: t });

      await queryInterface.bulkInsert('chuyenNganh', [
        { maChuyenNganh: 'CNPM', maKhoa: 'CNTT', maHe: 'CQ', maBac: 'DH', tenChuyenNganh: 'Cong nghe phan mem', soTinChi: 130, bangCap: 'Cu nhan', dieuKien: 'GPA >= 2.0' },
      ], { transaction: t });

      await queryInterface.bulkInsert('mon', [
        { maMon: 'IT101', maKhoa: 'CNTT', tenMon: 'Nhap mon lap trinh', kieuMonHoc: 'Bat buoc', moTa: 'Mon co so' },
        { maMon: 'IT201', maKhoa: 'CNTT', tenMon: 'Cau truc du lieu', kieuMonHoc: 'Bat buoc', moTa: 'Mon co so' },
      ], { transaction: t });

      await queryInterface.bulkInsert('monDaoTao', [
        { maCT: 'CTCNTT', maMon: 'IT101', maChuyenNganh: 'CNPM', soTinChi: 3, soTietLyThuyet: 30, soTietThucHanh: 15, hocPhi: 3500000.0 },
        { maCT: 'CTCNTT', maMon: 'IT201', maChuyenNganh: 'CNPM', soTinChi: 4, soTietLyThuyet: 30, soTietThucHanh: 30, hocPhi: 4200000.0 },
      ], { transaction: t });

      await queryInterface.bulkInsert('bangDiem', [
        { maMon: 'IT101', MSV: 'SV001', diemSo: 8.2, diemChu: 'B+' },
        { maMon: 'IT101', MSV: 'SV002', diemSo: 9.0, diemChu: 'A' },
      ], { transaction: t });

      await queryInterface.bulkInsert('lopTinChi', [
        { maLop: 'LTC001', MCB: 'CB002', maMon: 'IT101', kyDaoTao: '20261', soLuongSinhVienMax: 60, soLuongSinhVien: 0, trangThai: 'Dang mo' },
        { maLop: 'LTC002', MCB: 'CB002', maMon: 'IT201', kyDaoTao: '20261', soLuongSinhVienMax: 40, soLuongSinhVien: 0, trangThai: 'Dang mo' },
      ], { transaction: t });

      await queryInterface.bulkInsert('hocBong', [
        { maHocBong: 'HB001', tenHocBong: 'Hoc bong Khuyen khich', loaiHocBong: 'Kha, Gioi', donViCungCap: 'Truong', giaTri: 5000000, moTa: 'Danh cho SV co GPA >= 3.2' },
      ], { transaction: t });

      await queryInterface.bulkInsert('nghienCuu', [
        { maDeTai: 'NC001', tenDeTai: 'Ung dung AI trong y te', capDeTai: 'Truong', phanLoai: 'Cong nghe', donVi: 'Khoa CNTT', kinhPhi: 20000000, thoiGianBatDau: '2026-05-01', thoiGianKetThuc: '2026-12-31', moTa: 'Nghien cuu AI' },
      ], { transaction: t });

      await queryInterface.bulkInsert('doAnTN', [
        { maDoAn: 'DA001', tenDoAn: 'Xay dung he thong ERP', trangThai: 'Dang mo', diem: null, ngayBatDau: '2026-06-01', ngayBaoVe: '2026-12-15', bacDoAn: 'Dai hoc', moTa: 'Lam ERP cho doanh nghiep', dinhKem: '' },
      ], { transaction: t });

      await queryInterface.bulkInsert('duHoc', [
        { maSuat: 'DH001', tenChuongTrinh: 'Trao doi sinh vien Nhat Ban', loaiHinh: 'Trao doi', hocBong: true, donVi: 'Dai hoc ABC', chuyenNganh: 'IT', kinhPhiTaiTro: 100000000, bac: 'Dai hoc', namBatDau: 2026, namKetThuc: 2027, dieuKien: 'N3 Tieng Nhat', trangThai: 'Mo', quocGiaTheoHoc: 'Nhat Ban', donViTheoHoc: 'DH Tokyo', moTa: 'Chuong trinh 1 nam' },
      ], { transaction: t });

      await queryInterface.bulkInsert('suKien', [
        { maSuKien: 'SK001', tenSuKien: 'Tuan sinh hoat cong dan', donViToChuc: 'Phong CT SV', soLuongThamGia: 2, diaDiem: 'Hoi truong lon', thoiGianBatDau: new Date('2026-09-05T01:00:00.000Z'), thoiGianKetThuc: new Date('2026-09-05T05:00:00.000Z'), trangThai: 'Sap dien ra', moTa: 'Su kien bat buoc', loaiSuKien: 'Sinh hoat', batBuoc: true },
      ], { transaction: t });

      // Junction tables
      await queryInterface.bulkInsert('sinhVien_LopTinChi', [
        { MSV: 'SV001', maLop: 'LTC001', ngayDangKy: '2026-01-10' },
        { MSV: 'SV002', maLop: 'LTC001', ngayDangKy: '2026-01-10' },
      ], { transaction: t });

      await queryInterface.bulkInsert('sinhVien_HocBong', [
        { MSV: 'SV001', maHocBong: 'HB001', ngayNhan: '2025-12-20', phanTram: 100.0 },
      ], { transaction: t });

      await queryInterface.bulkInsert('sinhVien_NghienCuu', [
        { MSV: 'SV001', maDeTai: 'NC001', MCB: 'CB002', ngayThamGia: '2026-05-10', trangThai: 'Dang thuc hien', moTa: 'Thanh vien' },
      ], { transaction: t });

      await queryInterface.bulkInsert('sinhVien_DoAnTN', [
        { MSV: 'SV002', maDoAn: 'DA001', ngayDangKy: '2026-06-01', trangThai: 'Dang thuc hien' },
      ], { transaction: t });

      await queryInterface.bulkInsert('sinhVien_DuHoc', [
        { MSV: 'SV001', maSuat: 'DH001', ngayDangKy: '2026-02-15', phanTram: 50.0, trangThai: 'Cho duyet' },
      ], { transaction: t });

      await queryInterface.bulkInsert('sinhVien_SuKien', [
        { MSV: 'SV001', maSuKien: 'SK001', trangThai: 'Da dang ky' },
        { MSV: 'SV002', maSuKien: 'SK001', trangThai: 'Da dang ky' },
      ], { transaction: t });
    });
  },

  async down(queryInterface) {
    const { Op } = require('sequelize');
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkDelete('sinhVien_SuKien', null, { transaction: t });
      await queryInterface.bulkDelete('sinhVien_DuHoc', null, { transaction: t });
      await queryInterface.bulkDelete('sinhVien_DoAnTN', null, { transaction: t });
      await queryInterface.bulkDelete('sinhVien_NghienCuu', null, { transaction: t });
      await queryInterface.bulkDelete('sinhVien_HocBong', null, { transaction: t });
      await queryInterface.bulkDelete('sinhVien_LopTinChi', null, { transaction: t });
      await queryInterface.bulkDelete('suKien', null, { transaction: t });
      await queryInterface.bulkDelete('duHoc', null, { transaction: t });
      await queryInterface.bulkDelete('doAnTN', null, { transaction: t });
      await queryInterface.bulkDelete('nghienCuu', null, { transaction: t });
      await queryInterface.bulkDelete('hocBong', null, { transaction: t });
      await queryInterface.bulkDelete('lopTinChi', null, { transaction: t });
      await queryInterface.bulkDelete('bangDiem', { MSV: { [Op.in]: ['SV001', 'SV002'] } }, { transaction: t });
      await queryInterface.bulkDelete('monDaoTao', { maCT: 'CTCNTT' }, { transaction: t });
      await queryInterface.bulkDelete('mon', { maMon: { [Op.in]: ['IT101', 'IT201'] } }, { transaction: t });
      await queryInterface.bulkDelete('chuyenNganh', { maChuyenNganh: 'CNPM' }, { transaction: t });
      await queryInterface.bulkDelete('chuongTrinhDaoTao', { maCT: 'CTCNTT' }, { transaction: t });
      await queryInterface.bulkDelete('bac', { maBac: 'DH' }, { transaction: t });
      await queryInterface.bulkDelete('heDaoTao', { maHe: 'CQ' }, { transaction: t });
      await queryInterface.bulkDelete('sinhVien', { MSV: { [Op.in]: ['SV001', 'SV002'] } }, { transaction: t });
      await queryInterface.bulkDelete('canBo', { MCB: { [Op.in]: ['CB001', 'CB002', 'ADMIN01'] } }, { transaction: t });
      await queryInterface.bulkDelete('Khoa', { maKhoa: 'CNTT' }, { transaction: t });
      await queryInterface.bulkDelete('ttcn', { CCCD: { [Op.in]: ['001001001001', '001001001002', '001001001003', '001001001004', '001001001005'] } }, { transaction: t });
    });
  },
};
