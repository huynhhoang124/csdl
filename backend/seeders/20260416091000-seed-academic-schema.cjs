'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkInsert('ttcn', [
        { CCCD: '001001001001', lastName: 'Nguyen', name: 'An', ngaySinh: '2005-01-15', gioiTinh: 'Nam', soDienThoai: '0901000001', ngayCapCCCD: '2023-01-10', diaChiThuongTru: 'Ha Noi', diaChiTamTru: 'KTX A', quocTich: 'Viet Nam', danToc: 'Kinh', congGiao: 'Khong', baoHiem: 'BHYT001' },
        { CCCD: '001001001002', lastName: 'Tran', name: 'Binh', ngaySinh: '2005-03-22', gioiTinh: 'Nu', soDienThoai: '0901000002', ngayCapCCCD: '2023-02-15', diaChiThuongTru: 'Hai Phong', diaChiTamTru: 'KTX B', quocTich: 'Viet Nam', danToc: 'Kinh', congGiao: 'Khong', baoHiem: 'BHYT002' },
        { CCCD: '001001001003', lastName: 'Pham', name: 'Cuong', ngaySinh: '1985-06-10', gioiTinh: 'Nam', soDienThoai: '0901000003', ngayCapCCCD: '2021-04-12', diaChiThuongTru: 'Nam Dinh', diaChiTamTru: 'Ha Noi', quocTich: 'Viet Nam', danToc: 'Kinh', congGiao: 'Khong', baoHiem: 'BHYT003' },
        { CCCD: '001001001004', lastName: 'Le', name: 'Dung', ngaySinh: '1988-09-05', gioiTinh: 'Nu', soDienThoai: '0901000004', ngayCapCCCD: '2021-05-20', diaChiThuongTru: 'Thai Binh', diaChiTamTru: 'Ha Noi', quocTich: 'Viet Nam', danToc: 'Kinh', congGiao: 'Khong', baoHiem: 'BHYT004' },
      ], { transaction: t });

      await queryInterface.bulkInsert('sinhVien', [
        { MSV: 'SV001', CCCD: '001001001001', trangThai: 'Dang hoc', namHoc: 2023, khoaDaoTao: '2023-2027', tenNganHang: 'VCB', soTaiKhoan: '190010000001', GPA: 3.45, CPA: 3.4 },
        { MSV: 'SV002', CCCD: '001001001002', trangThai: 'Dang hoc', namHoc: 2023, khoaDaoTao: '2023-2027', tenNganHang: 'BIDV', soTaiKhoan: '190010000002', GPA: 3.68, CPA: 3.61 },
      ], { transaction: t });

      await queryInterface.bulkInsert('canBo', [
        { MCB: 'CB001', CCCD: '001001001003', viTriCongViec: 'Truong khoa', trangThai: 'Dang cong tac' },
        { MCB: 'CB002', CCCD: '001001001004', viTriCongViec: 'Giang vien', trangThai: 'Dang cong tac' },
      ], { transaction: t });

      await queryInterface.bulkInsert('Khoa', [
        { maKhoa: 'CNTT', MCB: 'CB001', vanPhongKhoa: 'Tang 3 toa A1', dienThoaiLienHe: '02473001234', emailLienHe: 'cntt@university.edu.vn', moTa: 'Khoa CNTT', ngayThanhLap: '2000-09-01' },
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

      await queryInterface.bulkInsert('monTienQuyet', [
        { maCT: 'CTCNTT', maMon: 'IT201', maChuyenNganh: 'CNPM', maTienQuyet: 'IT101', moTa: 'Hoan thanh IT101 truoc' },
      ], { transaction: t });

      await queryInterface.bulkInsert('bangDiem', [
        { maMon: 'IT101', MSV: 'SV001', diemSo: 8.2, diemChu: 'B+' },
        { maMon: 'IT101', MSV: 'SV002', diemSo: 9.0, diemChu: 'A' },
      ], { transaction: t });
    });
  },

  async down(queryInterface) {
    const { Op } = require('sequelize');
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkDelete('bangDiem', { MSV: { [Op.in]: ['SV001', 'SV002'] } }, { transaction: t });
      await queryInterface.bulkDelete('monTienQuyet', { maTienQuyet: 'IT101' }, { transaction: t });
      await queryInterface.bulkDelete('monDaoTao', { maCT: 'CTCNTT' }, { transaction: t });
      await queryInterface.bulkDelete('mon', { maMon: { [Op.in]: ['IT101', 'IT201'] } }, { transaction: t });
      await queryInterface.bulkDelete('chuyenNganh', { maChuyenNganh: 'CNPM' }, { transaction: t });
      await queryInterface.bulkDelete('chuongTrinhDaoTao', { maCT: 'CTCNTT' }, { transaction: t });
      await queryInterface.bulkDelete('bac', { maBac: 'DH' }, { transaction: t });
      await queryInterface.bulkDelete('heDaoTao', { maHe: 'CQ' }, { transaction: t });
      await queryInterface.bulkDelete('Khoa', { maKhoa: 'CNTT' }, { transaction: t });
      await queryInterface.bulkDelete('canBo', { MCB: { [Op.in]: ['CB001', 'CB002'] } }, { transaction: t });
      await queryInterface.bulkDelete('sinhVien', { MSV: { [Op.in]: ['SV001', 'SV002'] } }, { transaction: t });
      await queryInterface.bulkDelete('ttcn', { CCCD: { [Op.in]: ['001001001001', '001001001002', '001001001003', '001001001004'] } }, { transaction: t });
    });
  },
};
