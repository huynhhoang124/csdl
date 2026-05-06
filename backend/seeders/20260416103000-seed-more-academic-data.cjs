'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require('bcryptjs');
    const studentHash = bcrypt.hashSync('student123', 8);
    const teacherHash = bcrypt.hashSync('teacher123', 8);

    const personalRows = [
      {
        CCCD: '001001001006',
        Ho: 'HOANG',
        Ten: 'MINH',
        vaiTro: 'Sinh vien',
        matKhau: studentHash,
        ngaySinh: '2006-02-18',
        gioiTinh: 'Nam',
        soDienThoai: '0901000006',
        ngayCapCCCD: '2024-01-12',
        diaChiThuongTru: 'Quang Ninh',
        diaChiTamTru: 'Ky tuc xa C',
        quocTich: 'Viet Nam',
        danToc: 'Kinh',
        congGiao: 'Khong',
        baoHiem: 'BHYT006',
      },
      {
        CCCD: '001001001007',
        Ho: 'VU',
        Ten: 'LAN',
        vaiTro: 'Sinh vien',
        matKhau: studentHash,
        ngaySinh: '2006-11-05',
        gioiTinh: 'Nu',
        soDienThoai: '0901000007',
        ngayCapCCCD: '2024-03-20',
        diaChiThuongTru: 'Hai Duong',
        diaChiTamTru: 'Ky tuc xa C',
        quocTich: 'Viet Nam',
        danToc: 'Kinh',
        congGiao: 'Khong',
        baoHiem: 'BHYT007',
      },
      {
        CCCD: '001001001008',
        Ho: 'NGO',
        Ten: 'TUAN',
        vaiTro: 'Giang vien',
        matKhau: teacherHash,
        ngaySinh: '1990-04-12',
        gioiTinh: 'Nam',
        soDienThoai: '0901000008',
        ngayCapCCCD: '2022-08-15',
        diaChiThuongTru: 'Bac Ninh',
        diaChiTamTru: 'Ha Noi',
        quocTich: 'Viet Nam',
        danToc: 'Kinh',
        congGiao: 'Khong',
        baoHiem: 'BHYT008',
      },
    ];

    const staffRows = [
      {
        MCB: 'CB003',
        CCCD: '001001001008',
        viTriCongViec: 'Giang vien',
        trangThai: 'Dang cong tac',
      },
    ];

    const studentRows = [
      {
        MSV: 'SV003',
        CCCD: '001001001006',
        maKhoa: 'CNTT',
        trangThai: 'Dang hoc',
        namHoc: 2024,
        khoaDaoTao: '2024-2028',
        tenNganHang: 'Techcombank',
        soTaiKhoan: '190010000003',
        GPA: 3.52,
        CPA: 3.47,
      },
      {
        MSV: 'SV004',
        CCCD: '001001001007',
        maKhoa: 'CNTT',
        trangThai: 'Dang hoc',
        namHoc: 2024,
        khoaDaoTao: '2024-2028',
        tenNganHang: 'MB Bank',
        soTaiKhoan: '190010000004',
        GPA: 3.76,
        CPA: 3.71,
      },
    ];

    const subjectRows = [
      {
        maMon: 'IT301',
        maKhoa: 'CNTT',
        tenMon: 'Lap trinh Web',
        kieuMonHoc: 'Bat buoc',
        moTa: 'Mon hoc ve xay dung ung dung web full stack',
      },
      {
        maMon: 'IT302',
        maKhoa: 'CNTT',
        tenMon: 'Kiem thu phan mem',
        kieuMonHoc: 'Chuyen nganh',
        moTa: 'Mon hoc ve quy trinh va cong cu kiem thu phan mem',
      },
    ];

    const trainingSubjectRows = [
      {
        maCT: 'CTCNTT',
        maMon: 'IT301',
        maChuyenNganh: 'CNPM',
        soTinChi: 3,
        soTietLyThuyet: 30,
        soTietThucHanh: 30,
        hocPhi: 4500000.0,
      },
      {
        maCT: 'CTCNTT',
        maMon: 'IT302',
        maChuyenNganh: 'CNPM',
        soTinChi: 3,
        soTietLyThuyet: 30,
        soTietThucHanh: 15,
        hocPhi: 4300000.0,
      },
    ];

    const gradeRows = [
      { maMon: 'IT201', MSV: 'SV001', diemSo: 7.5, diemChu: 'B' },
      { maMon: 'IT201', MSV: 'SV002', diemSo: 8.5, diemChu: 'A' },
      { maMon: 'IT101', MSV: 'SV003', diemSo: 9.2, diemChu: 'A' },
      { maMon: 'IT101', MSV: 'SV004', diemSo: 8.8, diemChu: 'B+' },
    ];

    const creditClassRows = [
      {
        maLop: 'LTCIT30101',
        MCB: 'CB003',
        maMon: 'IT301',
        kyDaoTao: 20262,
        soLuongSinhVienMax: 50,
        soLuongSinhVien: 2,
        trangThai: 'Dang mo',
      },
      {
        maLop: 'LTCIT30201',
        MCB: 'CB002',
        maMon: 'IT302',
        kyDaoTao: 20262,
        soLuongSinhVienMax: 50,
        soLuongSinhVien: 1,
        trangThai: 'Sap mo',
      },
    ];

    const studentCreditClassRows = [
      { MSV: 'SV003', maLop: 'LTCIT30101', ngayDangKy: '2026-02-10' },
      { MSV: 'SV004', maLop: 'LTCIT30101', ngayDangKy: '2026-02-10' },
      { MSV: 'SV004', maLop: 'LTCIT30201', ngayDangKy: '2026-02-12' },
    ];

    const scholarshipRows = [
      {
        maHocBong: 'HB002',
        tenHocBong: 'Hoc bong doanh nghiep',
        loaiHocBong: 'Tai tro',
        dieuKien: 'Thanh tich tot',
        giaTri: 7000000.0,
        moTa: 'Hoc bong tu ABC Tech',
        donViCungCap: 'ABC Tech',
      },
    ];

    const eventRows = [
      {
        maSuKien: 'SK002',
        tenSuKien: 'Ngay hoi viec lam CNTT',
        donViToChuc: 'Khoa CNTT',
        soLuongThamGia: 2,
        diaDiem: 'San truong A1',
        thoiGianBatDau: new Date('2026-10-10T01:00:00.000Z'),
        thoiGianKetThuc: new Date('2026-10-10T10:00:00.000Z'),
        trangThai: 'Sap dien ra',
        moTa: 'Ket noi doanh nghiep',
        loaiSuKien: 'Huong nghiep',
        batBuoc: false,
      },
    ];

    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert('ttcn', personalRows, { transaction });
      await queryInterface.bulkInsert('canBo', staffRows, { transaction });
      await queryInterface.bulkInsert('sinhVien', studentRows, { transaction });
      await queryInterface.bulkInsert('mon', subjectRows, { transaction });
      await queryInterface.bulkInsert('monDaoTao', trainingSubjectRows, { transaction });
      await queryInterface.bulkInsert('bangDiem', gradeRows, { transaction });
      await queryInterface.bulkInsert('lopTinChi', creditClassRows, { transaction });
      await queryInterface.bulkInsert('sinhVien_LopTinChi', studentCreditClassRows, { transaction });
      await queryInterface.bulkInsert('hocBong', scholarshipRows, { transaction });
      await queryInterface.bulkInsert('suKien', eventRows, { transaction });
      
      // Additional junction data for demo
      await queryInterface.bulkInsert('sinhVien_HocBong', [
        { MSV: 'SV004', maHocBong: 'HB002', ngayNhan: '2026-03-01', phanTram: 100.0 }
      ], { transaction });

      await queryInterface.bulkInsert('sinhVien_SuKien', [
        { MSV: 'SV003', maSuKien: 'SK002', trangThai: 'Da dang ky' },
        { MSV: 'SV004', maSuKien: 'SK002', trangThai: 'Da dang ky' },
      ], { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete('sinhVien_SuKien', { maSuKien: 'SK002' }, { transaction });
      await queryInterface.bulkDelete('sinhVien_HocBong', { maHocBong: 'HB002' }, { transaction });
      await queryInterface.bulkDelete('suKien', { maSuKien: 'SK002' }, { transaction });
      await queryInterface.bulkDelete('hocBong', { maHocBong: 'HB002' }, { transaction });
      await queryInterface.bulkDelete('sinhVien_LopTinChi', { maLop: { [Op.in]: ['LTCIT30101', 'LTCIT30201'] } }, { transaction });
      await queryInterface.bulkDelete('lopTinChi', { maLop: { [Op.in]: ['LTCIT30101', 'LTCIT30201'] } }, { transaction });
      await queryInterface.bulkDelete('bangDiem', { MSV: { [Op.in]: ['SV003', 'SV004'] } }, { transaction });
      await queryInterface.bulkDelete('monDaoTao', { maMon: { [Op.in]: ['IT301', 'IT302'] } }, { transaction });
      await queryInterface.bulkDelete('mon', { maMon: { [Op.in]: ['IT301', 'IT302'] } }, { transaction });
      await queryInterface.bulkDelete('sinhVien', { MSV: { [Op.in]: ['SV003', 'SV004'] } }, { transaction });
      await queryInterface.bulkDelete('canBo', { MCB: 'CB003' }, { transaction });
      await queryInterface.bulkDelete('ttcn', { CCCD: { [Op.in]: ['001001001006', '001001001007', '001001001008'] } }, { transaction });
    });
  }
};
