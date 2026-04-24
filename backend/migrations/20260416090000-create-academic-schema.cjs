'use strict';

const id = (S, extra = {}) => ({ type: S.STRING(50), allowNull: false, ...extra });
const str = (S, extra = {}) => ({ type: S.STRING(255), ...extra });
const txt = (S, extra = {}) => ({ type: S.TEXT, ...extra });
const ref = (model, key) => ({ references: { model, key } });

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const S = Sequelize;
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('ttcn', {
        CCCD: id(S, { primaryKey: true }),
        lastName: str(S),
        name: str(S),
        ngaySinh: { type: S.DATEONLY },
        gioiTinh: str(S),
        soDienThoai: str(S),
        ngayCapCCCD: { type: S.DATEONLY },
        diaChiThuongTru: txt(S),
        diaChiTamTru: txt(S),
        quocTich: str(S),
        danToc: str(S),
        congGiao: str(S),
        baoHiem: str(S),
      }, { transaction: t });

      await queryInterface.createTable('sinhVien', {
        MSV: id(S, { primaryKey: true }),
        CCCD: { ...id(S), ...ref('ttcn', 'CCCD') },
        trangThai: str(S),
        namHoc: { type: S.INTEGER },
        khoaDaoTao: str(S),
        tenNganHang: str(S),
        soTaiKhoan: str(S),
        GPA: { type: S.FLOAT },
        CPA: { type: S.FLOAT },
      }, { transaction: t });

      await queryInterface.createTable('canBo', {
        MCB: id(S, { primaryKey: true }),
        CCCD: { ...id(S), ...ref('ttcn', 'CCCD') },
        viTriCongViec: str(S),
        trangThai: str(S),
      }, { transaction: t });

      await queryInterface.createTable('Khoa', {
        maKhoa: id(S, { primaryKey: true }),
        MCB: { ...id(S), ...ref('canBo', 'MCB') },
        vanPhongKhoa: str(S),
        dienThoaiLienHe: str(S),
        emailLienHe: str(S),
        moTa: txt(S),
        ngayThanhLap: { type: S.DATEONLY },
      }, { transaction: t });

      await queryInterface.createTable('heDaoTao', {
        maHe: id(S, { primaryKey: true }),
        tenHe: str(S),
        donVi: str(S),
        yeuCauDauVao: txt(S),
      }, { transaction: t });

      await queryInterface.createTable('bac', {
        maBac: id(S, { primaryKey: true }),
        tenBac: str(S),
        thoiGianDaoTao: { type: S.INTEGER },
        dieuKien: txt(S),
      }, { transaction: t });

      await queryInterface.createTable('chuongTrinhDaoTao', {
        maCT: id(S, { primaryKey: true }),
        tenCT: str(S),
        tenDonVi: str(S),
        giamDoc: str(S),
      }, { transaction: t });

      await queryInterface.createTable('chuyenNganh', {
        maChuyenNganh: id(S, { primaryKey: true }),
        maKhoa: { ...id(S), ...ref('Khoa', 'maKhoa') },
        maHe: { ...id(S), ...ref('heDaoTao', 'maHe') },
        maBac: { ...id(S), ...ref('bac', 'maBac') },
        tenChuyenNganh: str(S),
        soTinChi: { type: S.INTEGER },
        bangCap: str(S),
        dieuKien: txt(S),
      }, { transaction: t });

      await queryInterface.createTable('mon', {
        maMon: id(S, { primaryKey: true }),
        maKhoa: { ...id(S), ...ref('Khoa', 'maKhoa') },
        tenMon: str(S),
        kieuMonHoc: str(S),
        moTa: txt(S),
      }, { transaction: t });

      await queryInterface.createTable('monDaoTao', {
        maCT: { ...id(S, { primaryKey: true }), ...ref('chuongTrinhDaoTao', 'maCT') },
        maMon: { ...id(S, { primaryKey: true }), ...ref('mon', 'maMon') },
        maChuyenNganh: { ...id(S, { primaryKey: true }), ...ref('chuyenNganh', 'maChuyenNganh') },
        soTinChi: { type: S.INTEGER },
        soTietLyThuyet: { type: S.INTEGER },
        soTietThucHanh: { type: S.INTEGER },
        hocPhi: { type: S.DECIMAL(18, 2) },
      }, { transaction: t });

      await queryInterface.createTable('monTienQuyet', {
        maCT: id(S, { primaryKey: true }),
        maMon: id(S, { primaryKey: true }),
        maChuyenNganh: id(S, { primaryKey: true }),
        maTienQuyet: { ...id(S, { primaryKey: true }), ...ref('mon', 'maMon') },
        moTa: txt(S),
      }, { transaction: t });

      await queryInterface.addConstraint('monTienQuyet', {
        fields: ['maCT', 'maMon', 'maChuyenNganh'],
        type: 'foreign key',
        name: 'fk_monTienQuyet_monDaoTao',
        references: { table: 'monDaoTao', fields: ['maCT', 'maMon', 'maChuyenNganh'] },
        transaction: t,
      });

      await queryInterface.createTable('bangDiem', {
        maMon: { ...id(S, { primaryKey: true }), ...ref('mon', 'maMon') },
        MSV: { ...id(S, { primaryKey: true }), ...ref('sinhVien', 'MSV') },
        diemSo: { type: S.FLOAT },
        diemChu: str(S),
      }, { transaction: t });

      await queryInterface.createTable('lopHanhChinh', {
        maLop: id(S, { primaryKey: true }),
        maHe: { ...id(S), ...ref('heDaoTao', 'maHe') },
        maBac: { ...id(S), ...ref('bac', 'maBac') },
        maChuyenNganh: { ...id(S), ...ref('chuyenNganh', 'maChuyenNganh') },
        coVanhocTap: { ...id(S), ...ref('canBo', 'MCB') },
        siSo: { type: S.INTEGER },
        moTa: txt(S),
      }, { transaction: t });

      await queryInterface.createTable('lopTinChi', {
        maLop: id(S, { primaryKey: true }),
        MCB: { ...id(S), ...ref('canBo', 'MCB') },
        maMon: { ...id(S), ...ref('mon', 'maMon') },
        kyDaoTao: { type: S.INTEGER },
        soLuongSinhVienMax: { type: S.INTEGER },
        soLuongSinhVien: { type: S.INTEGER },
        trangThai: str(S),
      }, { transaction: t });

      await queryInterface.createTable('sinhVien_LopHanhChinh', {
        MSV: { ...id(S, { primaryKey: true }), ...ref('sinhVien', 'MSV') },
        maLop: { ...id(S, { primaryKey: true }), ...ref('lopHanhChinh', 'maLop') },
      }, { transaction: t });

      await queryInterface.createTable('sinhVien_LopTinChi', {
        MSV: { ...id(S, { primaryKey: true }), ...ref('sinhVien', 'MSV') },
        maLop: { ...id(S, { primaryKey: true }), ...ref('lopTinChi', 'maLop') },
        ngayDangKy: { type: S.DATEONLY },
      }, { transaction: t });

      await queryInterface.createTable('hocBong', {
        maHocBong: id(S, { primaryKey: true }),
        tenHocBong: str(S),
        loaiHocBong: str(S),
        dieuKien: txt(S),
        giaTri: { type: S.DECIMAL(18, 2) },
        moTa: txt(S),
        donViCungCap: str(S),
      }, { transaction: t });

      await queryInterface.createTable('sinhVien_HocBong', {
        MSV: { ...id(S, { primaryKey: true }), ...ref('sinhVien', 'MSV') },
        maHocBong: { ...id(S, { primaryKey: true }), ...ref('hocBong', 'maHocBong') },
        ngayNhan: { type: S.DATEONLY },
        phanTram: { type: S.DECIMAL(5, 2) },
      }, { transaction: t });

      await queryInterface.createTable('nghienCuu', {
        maDeTai: id(S, { primaryKey: true }),
        tenDeTai: str(S),
        capDeTai: str(S),
        phanLoai: str(S),
        donVi: str(S),
        kinhPhi: { type: S.DECIMAL(18, 2) },
        thoiGianBatDau: { type: S.DATEONLY },
        thoiGianKetThuc: { type: S.DATEONLY },
        moTa: txt(S),
      }, { transaction: t });

      await queryInterface.createTable('sinhVien_NghienCuu', {
        MSV: { ...id(S, { primaryKey: true }), ...ref('sinhVien', 'MSV') },
        maDeTai: { ...id(S, { primaryKey: true }), ...ref('nghienCuu', 'maDeTai') },
        vaiTro: str(S),
        ngayThamGia: { type: S.DATEONLY },
      }, { transaction: t });

      await queryInterface.createTable('doAnTN', {
        maDoAn: id(S, { primaryKey: true }),
        tenDoAn: str(S),
        trangThai: str(S),
        diem: { type: S.FLOAT },
        ngayBatDau: { type: S.DATEONLY },
        ngayBaoVe: { type: S.DATEONLY },
        bacDoAn: str(S),
        moTa: txt(S),
        dinhKem: str(S),
      }, { transaction: t });

      await queryInterface.createTable('sinhVien_DoAnTN', {
        MSV: { ...id(S, { primaryKey: true }), ...ref('sinhVien', 'MSV') },
        maDoAn: { ...id(S, { primaryKey: true }), ...ref('doAnTN', 'maDoAn') },
        vaiTro: str(S),
      }, { transaction: t });

      await queryInterface.createTable('duHoc', {
        maSuat: id(S, { primaryKey: true }),
        tenChuongTrinh: str(S),
        loaiHinh: str(S),
        hocBong: { type: S.BOOLEAN },
        donVi: str(S),
        chuyenNganh: str(S),
        kinhPhiTaiTro: { type: S.DECIMAL(18, 2) },
        bac: str(S),
        namBatDau: { type: S.INTEGER },
        namKetThuc: { type: S.INTEGER },
        dieuKien: txt(S),
        trangThai: str(S),
        quocGiaTheoHoc: str(S),
        donViTheoHoc: str(S),
        moTa: txt(S),
      }, { transaction: t });

      await queryInterface.createTable('sinhVien_DuHoc', {
        MSV: { ...id(S, { primaryKey: true }), ...ref('sinhVien', 'MSV') },
        maSuat: { ...id(S, { primaryKey: true }), ...ref('duHoc', 'maSuat') },
        trangThai: str(S),
        ngayDangKy: { type: S.DATEONLY },
      }, { transaction: t });

      await queryInterface.createTable('suKien', {
        maSuKien: id(S, { primaryKey: true }),
        tenSuKien: str(S),
        donViToChuc: str(S),
        soLuongThamGia: { type: S.INTEGER },
        diaDiem: str(S),
        thoiGianBatDau: { type: S.DATE },
        thoiGianKetThuc: { type: S.DATE },
        trangThai: str(S),
        moTa: txt(S),
        loaiSuKien: str(S),
        batBuoc: { type: S.BOOLEAN },
      }, { transaction: t });

      await queryInterface.createTable('sinhVien_SuKien', {
        MSV: { ...id(S, { primaryKey: true }), ...ref('sinhVien', 'MSV') },
        maSuKien: { ...id(S, { primaryKey: true }), ...ref('suKien', 'maSuKien') },
        trangThai: str(S),
      }, { transaction: t });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const drops = [
        'sinhVien_SuKien', 'suKien',
        'sinhVien_DuHoc', 'duHoc',
        'sinhVien_DoAnTN', 'doAnTN',
        'sinhVien_NghienCuu', 'nghienCuu',
        'sinhVien_HocBong', 'hocBong',
        'sinhVien_LopTinChi', 'sinhVien_LopHanhChinh',
        'lopTinChi', 'lopHanhChinh',
        'bangDiem',
      ];
      for (const tbl of drops) await queryInterface.dropTable(tbl, { transaction: t });
      await queryInterface.removeConstraint('monTienQuyet', 'fk_monTienQuyet_monDaoTao', { transaction: t });
      const tail = [
        'monTienQuyet', 'monDaoTao', 'mon',
        'chuyenNganh', 'chuongTrinhDaoTao', 'bac', 'heDaoTao',
        'Khoa', 'canBo', 'sinhVien', 'ttcn',
      ];
      for (const tbl of tail) await queryInterface.dropTable(tbl, { transaction: t });
    });
  },
};
