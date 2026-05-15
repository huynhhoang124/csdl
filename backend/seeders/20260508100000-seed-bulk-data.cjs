'use strict';

/**
 * Seed ~500 sinh viên, ~20 giảng viên, ~2000 bảng điểm, ~100 lớp tín chỉ
 * để SQL Server dùng index thay vì scan.
 */
module.exports = {
  async up(queryInterface) {
    const bcrypt = require('bcryptjs');
    const studentHash = bcrypt.hashSync('student123', 8);
    const teacherHash = bcrypt.hashSync('teacher123', 8);

    await queryInterface.sequelize.transaction(async (transaction) => {
      // ---- Thêm Khoa ----
      const khoaRows = [
        { maKhoa: 'DTVT', vanPhongKhoa: 'Tang 2 toa B1', dienThoaiLienHe: '02473001235', emailLienHe: 'dtvt@university.edu.vn', moTa: 'Khoa Dien tu Vien thong', ngayThanhLap: '2001-09-01' },
        { maKhoa: 'QTKD', vanPhongKhoa: 'Tang 4 toa C1', dienThoaiLienHe: '02473001236', emailLienHe: 'qtkd@university.edu.vn', moTa: 'Khoa Quan tri Kinh doanh', ngayThanhLap: '2002-09-01' },
        { maKhoa: 'ATTT', vanPhongKhoa: 'Tang 5 toa A2', dienThoaiLienHe: '02473001237', emailLienHe: 'attt@university.edu.vn', moTa: 'Khoa An toan Thong tin', ngayThanhLap: '2010-09-01' },
      ];
      await queryInterface.bulkInsert('Khoa', khoaRows, { transaction });

      // ---- Thêm 20 giảng viên ----
      const gvTtcnRows = [];
      const gvCanBoRows = [];
      const khoaList = ['CNTT', 'DTVT', 'QTKD', 'ATTT'];
      const hoList = ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Vu', 'Dang', 'Bui', 'Do', 'Ngo'];
      const tenGVList = ['Hung', 'Hoa', 'Duc', 'Mai', 'Tung', 'Linh', 'Khanh', 'Minh', 'Phuong', 'Duy',
                         'Thao', 'Long', 'Ha', 'Tien', 'Son', 'Ngoc', 'Quang', 'Hai', 'Yen', 'Viet'];

      for (let i = 0; i < 20; i++) {
        const cccd = `002002002${String(i).padStart(3, '0')}`;
        const mcb = `GV${String(i + 1).padStart(3, '0')}`;
        gvTtcnRows.push({
          CCCD: cccd, Ho: hoList[i % hoList.length], Ten: tenGVList[i],
          vaiTro: 'Giang vien', matKhau: teacherHash,
          ngaySinh: `${1980 + (i % 15)}-${String((i % 12) + 1).padStart(2, '0')}-15`,
          gioiTinh: i % 3 === 0 ? 'Nu' : 'Nam',
          soDienThoai: `090200${String(i).padStart(4, '0')}`,
          ngayCapCCCD: '2021-06-01',
          diaChiThuongTru: 'Ha Noi', diaChiTamTru: 'Ha Noi',
          quocTich: 'Viet Nam', danToc: 'Kinh', congGiao: 'Khong', baoHiem: `BHYTGV${i}`,
        });
        gvCanBoRows.push({
          MCB: mcb, CCCD: cccd, maKhoa: khoaList[i % khoaList.length],
          viTriCongViec: 'Giang vien', trangThai: 'Dang cong tac',
        });
      }
      await queryInterface.bulkInsert('ttcn', gvTtcnRows, { transaction });
      await queryInterface.bulkInsert('canBo', gvCanBoRows, { transaction });

      // ---- Thêm chuyên ngành ----
      const cnRows = [
        { maChuyenNganh: 'HTTT', maKhoa: 'CNTT', maHe: 'CQ', maBac: 'DH', tenChuyenNganh: 'He thong thong tin', soTinChi: 130, bangCap: 'Cu nhan', dieuKien: 'GPA >= 2.0' },
        { maChuyenNganh: 'KTMT', maKhoa: 'DTVT', maHe: 'CQ', maBac: 'DH', tenChuyenNganh: 'Ky thuat may tinh', soTinChi: 135, bangCap: 'Ky su', dieuKien: 'GPA >= 2.0' },
        { maChuyenNganh: 'MARKETING', maKhoa: 'QTKD', maHe: 'CQ', maBac: 'DH', tenChuyenNganh: 'Marketing', soTinChi: 125, bangCap: 'Cu nhan', dieuKien: 'GPA >= 2.0' },
        { maChuyenNganh: 'ANNINH', maKhoa: 'ATTT', maHe: 'CQ', maBac: 'DH', tenChuyenNganh: 'An ninh mang', soTinChi: 130, bangCap: 'Ky su', dieuKien: 'GPA >= 2.0' },
      ];
      await queryInterface.bulkInsert('chuyenNganh', cnRows, { transaction });

      // ---- Thêm môn học ----
      const monRows = [];
      const monNames = [
        'Co so du lieu', 'Mang may tinh', 'He dieu hanh', 'Toan roi rac',
        'Xac suat thong ke', 'Tri tue nhan tao', 'Hoc may', 'Xu ly anh',
        'Phan tich thiet ke HTTT', 'Quan tri du an PM', 'Lap trinh di dong',
        'An toan bao mat', 'Dien tu so', 'Xu ly tin hieu', 'Marketing co ban',
        'Kinh te vi mo', 'Lap trinh Python', 'Lap trinh Java', 'DevOps', 'Cloud Computing',
      ];
      for (let i = 0; i < monNames.length; i++) {
        monRows.push({
          maMon: `MON${String(i + 1).padStart(3, '0')}`,
          maKhoa: khoaList[i % khoaList.length],
          tenMon: monNames[i],
          kieuMonHoc: i < 10 ? 'Bat buoc' : 'Chuyen nganh',
          moTa: `Mon hoc ${monNames[i]}`,
        });
      }
      await queryInterface.bulkInsert('mon', monRows, { transaction });

      // ---- Thêm 500 sinh viên ----
      const svTtcnRows = [];
      const svRows = [];
      const tenSVList = ['An', 'Binh', 'Cuong', 'Dung', 'Em', 'Phuc', 'Giang', 'Hieu', 'Ich', 'Kien',
                         'Lam', 'My', 'Nhan', 'Oanh', 'Phong', 'Quy', 'Rong', 'Son', 'Tung', 'Uyen'];
      const trangThaiList = ['Dang hoc', 'Dang hoc', 'Dang hoc', 'Dang hoc', 'Bao luu', 'Da tot nghiep', 'Dinh chi'];

      for (let i = 0; i < 500; i++) {
        const cccd = `003003003${String(i).padStart(3, '0')}`;
        const msv = `SVBK${String(i + 1).padStart(4, '0')}`;
        const gpa = Math.round((1.5 + Math.random() * 2.5) * 100) / 100; // 1.5 - 4.0

        svTtcnRows.push({
          CCCD: cccd, Ho: hoList[i % hoList.length], Ten: tenSVList[i % tenSVList.length],
          vaiTro: 'Sinh vien', matKhau: studentHash,
          ngaySinh: `${2003 + (i % 4)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
          gioiTinh: i % 3 === 0 ? 'Nu' : 'Nam',
          soDienThoai: `091${String(i).padStart(7, '0')}`,
          ngayCapCCCD: '2023-01-01',
          diaChiThuongTru: ['Ha Noi', 'Hai Phong', 'Nam Dinh', 'Thai Binh', 'Bac Ninh', 'Quang Ninh'][i % 6],
          diaChiTamTru: `KTX ${String.fromCharCode(65 + (i % 5))}`,
          quocTich: 'Viet Nam', danToc: 'Kinh', congGiao: 'Khong',
          baoHiem: `BHYTSV${i}`,
        });
        svRows.push({
          MSV: msv, CCCD: cccd, maKhoa: khoaList[i % khoaList.length],
          trangThai: trangThaiList[i % trangThaiList.length],
          namHoc: 2022 + (i % 4), khoaDaoTao: `${2022 + (i % 4)}-${2026 + (i % 4)}`,
          tenNganHang: ['VCB', 'BIDV', 'Techcombank', 'MB Bank', 'VPBank'][i % 5],
          soTaiKhoan: `19001${String(i).padStart(7, '0')}`,
          GPA: gpa, CPA: Math.round((gpa - 0.05 + Math.random() * 0.1) * 100) / 100,
        });
      }
      // Bulk insert in chunks to avoid query too large
      for (let c = 0; c < svTtcnRows.length; c += 100) {
        await queryInterface.bulkInsert('ttcn', svTtcnRows.slice(c, c + 100), { transaction });
      }
      for (let c = 0; c < svRows.length; c += 100) {
        await queryInterface.bulkInsert('sinhVien', svRows.slice(c, c + 100), { transaction });
      }

      // ---- Thêm 100 lớp tín chỉ ----
      const ltcRows = [];
      const allMon = ['IT101', 'IT201', 'IT301', 'IT302',
                      ...monRows.map(m => m.maMon)];
      for (let i = 0; i < 100; i++) {
        ltcRows.push({
          maLop: `LTCBK${String(i + 1).padStart(4, '0')}`,
          MCB: `GV${String((i % 20) + 1).padStart(3, '0')}`,
          maMon: allMon[i % allMon.length],
          kyDaoTao: `2026${(i % 2) + 1}`,
          soLuongSinhVienMax: 50 + (i % 3) * 10,
          soLuongSinhVien: Math.floor(Math.random() * 40),
          trangThai: ['Dang mo', 'Dang mo', 'Dang mo', 'Da dong', 'Sap mo'][i % 5],
        });
      }
      await queryInterface.bulkInsert('lopTinChi', ltcRows, { transaction });

      // ---- Thêm ~2000 bảng điểm ----
      const bdRows = [];
      const diemChuMap = (d) => {
        if (d >= 9) return 'A';
        if (d >= 8) return 'B+';
        if (d >= 7) return 'B';
        if (d >= 6) return 'C+';
        if (d >= 5) return 'C';
        if (d >= 4) return 'D';
        return 'F';
      };
      const usedPairs = new Set();
      for (let i = 0; i < 2000; i++) {
        const msv = `SVBK${String((i % 500) + 1).padStart(4, '0')}`;
        const maMon = allMon[Math.floor(i / 500) % allMon.length + (i % allMon.length)] 
                      ? allMon[(Math.floor(i / 83) + i) % allMon.length] 
                      : allMon[i % allMon.length];
        const pairKey = `${maMon}_${msv}`;
        if (usedPairs.has(pairKey)) continue;
        usedPairs.add(pairKey);
        const diem = Math.round((3 + Math.random() * 7) * 10) / 10;
        bdRows.push({ maMon, MSV: msv, diemSo: diem, diemChu: diemChuMap(diem) });
      }
      for (let c = 0; c < bdRows.length; c += 100) {
        await queryInterface.bulkInsert('bangDiem', bdRows.slice(c, c + 100), { transaction });
      }

      // ---- Thêm nghiên cứu & sinhVien_NghienCuu ----
      const ncRows = [];
      for (let i = 0; i < 20; i++) {
        ncRows.push({
          maDeTai: `NCBK${String(i + 1).padStart(3, '0')}`,
          tenDeTai: `De tai nghien cuu so ${i + 1}`,
          capDeTai: i < 10 ? 'Truong' : 'Khoa',
          phanLoai: 'Cong nghe', donVi: `Khoa ${khoaList[i % khoaList.length]}`,
          kinhPhi: 10000000 + i * 5000000,
          thoiGianBatDau: '2026-01-01', thoiGianKetThuc: '2026-12-31',
          moTa: `Mo ta de tai ${i + 1}`,
        });
      }
      await queryInterface.bulkInsert('nghienCuu', ncRows, { transaction });

      const svncRows = [];
      const usedSVNC = new Set();
      for (let i = 0; i < 100; i++) {
        const msv = `SVBK${String((i % 100) + 1).padStart(4, '0')}`;
        const maDeTai = `NCBK${String((i % 20) + 1).padStart(3, '0')}`;
        const pairKey = `${msv}_${maDeTai}`;
        if (usedSVNC.has(pairKey)) continue;
        usedSVNC.add(pairKey);
        svncRows.push({
          MSV: msv, maDeTai,
          MCB: `GV${String((i % 20) + 1).padStart(3, '0')}`,
          ngayThamGia: '2026-03-01', trangThai: 'Dang thuc hien', moTa: 'Thanh vien',
        });
      }
      await queryInterface.bulkInsert('sinhVien_NghienCuu', svncRows, { transaction });

      // ---- Thêm sự kiện ----
      const skRows = [];
      for (let i = 0; i < 15; i++) {
        skRows.push({
          maSuKien: `SKBK${String(i + 1).padStart(3, '0')}`,
          tenSuKien: `Su kien so ${i + 1}`,
          donViToChuc: `Khoa ${khoaList[i % khoaList.length]}`,
          soLuongThamGia: 50 + i * 10,
          diaDiem: 'Hoi truong lon',
          thoiGianBatDau: new Date(`2026-${String((i % 12) + 1).padStart(2, '0')}-15T01:00:00.000Z`),
          thoiGianKetThuc: new Date(`2026-${String((i % 12) + 1).padStart(2, '0')}-15T05:00:00.000Z`),
          trangThai: ['Sap dien ra', 'Dang dien ra', 'Da ket thuc'][i % 3],
          moTa: `Mo ta su kien ${i + 1}`, loaiSuKien: 'Hoi thao', batBuoc: i % 4 === 0,
        });
      }
      await queryInterface.bulkInsert('suKien', skRows, { transaction });

      // ---- Lớp hành chính ----
      const lhcRows = [];
      const cnList = ['CNPM', 'HTTT', 'KTMT', 'MARKETING', 'ANNINH'];
      for (let i = 0; i < 20; i++) {
        lhcRows.push({
          maLop: `LHC${String(i + 1).padStart(3, '0')}`,
          maHe: 'CQ', maBac: 'DH',
          maChuyenNganh: cnList[i % cnList.length],
          coVanhocTap: `GV${String((i % 20) + 1).padStart(3, '0')}`,
          siSo: 30 + (i % 3) * 5,
          moTa: `Lop hanh chinh ${i + 1}`,
        });
      }
      await queryInterface.bulkInsert('lopHanhChinh', lhcRows, { transaction });
    });
  },

  async down(queryInterface) {
    const { Op } = require('sequelize');
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Xóa theo thứ tự ngược phụ thuộc FK
      await queryInterface.bulkDelete('sinhVien_NghienCuu',
        { MSV: { [Op.like]: 'SVBK%' } }, { transaction });
      await queryInterface.bulkDelete('bangDiem',
        { MSV: { [Op.like]: 'SVBK%' } }, { transaction });
      await queryInterface.bulkDelete('lopHanhChinh',
        { maLop: { [Op.like]: 'LHC%' } }, { transaction });
      await queryInterface.bulkDelete('lopTinChi',
        { maLop: { [Op.like]: 'LTCBK%' } }, { transaction });
      await queryInterface.bulkDelete('suKien',
        { maSuKien: { [Op.like]: 'SKBK%' } }, { transaction });
      await queryInterface.bulkDelete('nghienCuu',
        { maDeTai: { [Op.like]: 'NCBK%' } }, { transaction });
      await queryInterface.bulkDelete('sinhVien',
        { MSV: { [Op.like]: 'SVBK%' } }, { transaction });
      await queryInterface.bulkDelete('mon',
        { maMon: { [Op.like]: 'MON%' } }, { transaction });
      await queryInterface.bulkDelete('chuyenNganh',
        { maChuyenNganh: { [Op.in]: ['HTTT', 'KTMT', 'MARKETING', 'ANNINH'] } }, { transaction });
      await queryInterface.bulkDelete('canBo',
        { MCB: { [Op.like]: 'GV%' } }, { transaction });
      await queryInterface.bulkDelete('ttcn',
        { CCCD: { [Op.or]: [{ [Op.like]: '002002%' }, { [Op.like]: '003003%' }] } }, { transaction });
      await queryInterface.bulkDelete('Khoa',
        { maKhoa: { [Op.in]: ['DTVT', 'QTKD', 'ATTT'] } }, { transaction });
    });
  },
};
