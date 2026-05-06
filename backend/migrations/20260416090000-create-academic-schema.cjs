'use strict';

const buildIdColumn = (Sequelize, extra = {}) => ({
  type: Sequelize.STRING(50),
  allowNull: false,
  ...extra,
});

const buildStringColumn = (Sequelize, extra = {}) => ({
  type: Sequelize.STRING(255),
  ...extra,
});

const buildTextColumn = (Sequelize, extra = {}) => ({
  type: Sequelize.TEXT,
  ...extra,
});

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'ttcn',
        {
          CCCD: buildIdColumn(Sequelize, { primaryKey: true }),
          Ho: buildStringColumn(Sequelize),
          Ten: buildStringColumn(Sequelize),
          vaiTro: buildStringColumn(Sequelize),
          matKhau: buildStringColumn(Sequelize),
          ngaySinh: {
            type: Sequelize.DATEONLY,
          },
          gioiTinh: buildStringColumn(Sequelize),
          soDienThoai: buildStringColumn(Sequelize),
          ngayCapCCCD: {
            type: Sequelize.DATEONLY,
          },
          diaChiThuongTru: buildTextColumn(Sequelize),
          diaChiTamTru: buildTextColumn(Sequelize),
          quocTich: buildStringColumn(Sequelize),
          danToc: buildStringColumn(Sequelize),
          congGiao: buildStringColumn(Sequelize),
          baoHiem: buildStringColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'canBo',
        {
          MCB: buildIdColumn(Sequelize, { primaryKey: true }),
          CCCD: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'ttcn',
              key: 'CCCD',
            },
          },
          viTriCongViec: buildStringColumn(Sequelize),
          trangThai: buildStringColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'Khoa',
        {
          maKhoa: buildIdColumn(Sequelize, { primaryKey: true }),
          MCB: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'canBo',
              key: 'MCB',
            },
          },
          vanPhongKhoa: buildStringColumn(Sequelize),
          dienThoaiLienHe: buildStringColumn(Sequelize),
          emailLienHe: buildStringColumn(Sequelize),
          moTa: buildTextColumn(Sequelize),
          ngayThanhLap: {
            type: Sequelize.DATEONLY,
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        'sinhVien',
        {
          MSV: buildIdColumn(Sequelize, { primaryKey: true }),
          CCCD: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'ttcn',
              key: 'CCCD',
            },
          },
          maKhoa: buildIdColumn(Sequelize),
          trangThai: buildStringColumn(Sequelize),
          namHoc: {
            type: Sequelize.INTEGER,
          },
          khoaDaoTao: buildStringColumn(Sequelize),
          tenNganHang: buildStringColumn(Sequelize),
          soTaiKhoan: buildStringColumn(Sequelize),
          GPA: {
            type: Sequelize.FLOAT,
          },
          CPA: {
            type: Sequelize.FLOAT,
          },
        },
        { transaction }
      );

      await queryInterface.addConstraint('sinhVien', {
        fields: ['maKhoa'],
        type: 'foreign key',
        name: 'fk_sinhVien_Khoa',
        references: {
          table: 'Khoa',
          field: 'maKhoa',
        },
        transaction,
      });

      await queryInterface.createTable(
        'heDaoTao',
        {
          maHe: buildIdColumn(Sequelize, { primaryKey: true }),
          tenHe: buildStringColumn(Sequelize),
          donVi: buildStringColumn(Sequelize),
          yeuCauDauVao: buildTextColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'bac',
        {
          maBac: buildIdColumn(Sequelize, { primaryKey: true }),
          tenBac: buildStringColumn(Sequelize),
          thoiGianDaoTao: {
            type: Sequelize.INTEGER,
          },
          dieuKien: buildTextColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'chuongTrinhDaoTao',
        {
          maCT: buildIdColumn(Sequelize, { primaryKey: true }),
          tenCT: buildStringColumn(Sequelize),
          tenDonVi: buildStringColumn(Sequelize),
          giamDoc: buildStringColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'chuyenNganh',
        {
          maChuyenNganh: buildIdColumn(Sequelize, { primaryKey: true }),
          maKhoa: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'Khoa',
              key: 'maKhoa',
            },
          },
          maHe: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'heDaoTao',
              key: 'maHe',
            },
          },
          maBac: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'bac',
              key: 'maBac',
            },
          },
          tenChuyenNganh: buildStringColumn(Sequelize),
          soTinChi: {
            type: Sequelize.INTEGER,
          },
          dieuKien: buildTextColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'mon',
        {
          maMon: buildIdColumn(Sequelize, { primaryKey: true }),
          maKhoa: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'Khoa',
              key: 'maKhoa',
            },
          },
          tenMon: buildStringColumn(Sequelize),
          kieuMonHoc: buildStringColumn(Sequelize),
          moTa: buildTextColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'monDaoTao',
        {
          maCT: {
            ...buildIdColumn(Sequelize, {
              primaryKey: true,
            }),
            references: {
              model: 'chuongTrinhDaoTao',
              key: 'maCT',
            },
          },
          // MSSQL requires the referenced composite key order to match exactly.
          maMon: {
            ...buildIdColumn(Sequelize, {
              primaryKey: true,
            }),
            references: {
              model: 'mon',
              key: 'maMon',
            },
          },
          maChuyenNganh: {
            ...buildIdColumn(Sequelize, {
              primaryKey: true,
            }),
            references: {
              model: 'chuyenNganh',
              key: 'maChuyenNganh',
            },
          },
          soTinChi: {
            type: Sequelize.INTEGER,
          },
          soTietLyThuyet: {
            type: Sequelize.INTEGER,
          },
          soTietThucHanh: {
            type: Sequelize.INTEGER,
          },
          hocPhi: {
            type: Sequelize.DECIMAL(18, 2),
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        'bangDiem',
        {
          maMon: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'mon',
              key: 'maMon',
            },
          },
          MSV: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'sinhVien',
              key: 'MSV',
            },
          },
          diemSo: {
            type: Sequelize.FLOAT,
          },
          diemChu: buildStringColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'lopHanhChinh',
        {
          maLop: buildIdColumn(Sequelize, { primaryKey: true }),
          maHe: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'heDaoTao',
              key: 'maHe',
            },
          },
          maBac: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'bac',
              key: 'maBac',
            },
          },
          maChuyenNganh: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'chuyenNganh',
              key: 'maChuyenNganh',
            },
          },
          coVanhocTap: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'canBo',
              key: 'MCB',
            },
          },
          siSo: {
            type: Sequelize.INTEGER,
          },
          moTa: buildTextColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'lopTinChi',
        {
          maLop: buildIdColumn(Sequelize, { primaryKey: true }),
          MCB: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'canBo',
              key: 'MCB',
            },
          },
          maMon: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'mon',
              key: 'maMon',
            },
          },
          kyDaoTao: buildStringColumn(Sequelize),
          soLuongSinhVienMax: {
            type: Sequelize.INTEGER,
          },
          soLuongSinhVien: {
            type: Sequelize.INTEGER,
          },
          trangThai: buildStringColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'sinhVien_LopHanhChinh',
        {
          MSV: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'sinhVien',
              key: 'MSV',
            },
          },
          maLop: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'lopHanhChinh',
              key: 'maLop',
            },
          },
          ngayDangKy: {
            type: Sequelize.DATEONLY,
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        'sinhVien_LopTinChi',
        {
          MSV: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'sinhVien',
              key: 'MSV',
            },
          },
          maLop: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'lopTinChi',
              key: 'maLop',
            },
          },
          ngayDangKy: {
            type: Sequelize.DATEONLY,
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        'hocBong',
        {
          maHocBong: buildIdColumn(Sequelize, { primaryKey: true }),
          tenHocBong: buildStringColumn(Sequelize),
          loaiHocBong: buildStringColumn(Sequelize),
          dieuKien: buildTextColumn(Sequelize),
          giaTri: {
            type: Sequelize.DECIMAL(18, 2),
          },
          moTa: buildTextColumn(Sequelize),
          donViCungCap: buildStringColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'sinhVien_HocBong',
        {
          MSV: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'sinhVien',
              key: 'MSV',
            },
          },
          maHocBong: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'hocBong',
              key: 'maHocBong',
            },
          },
          ngayNhan: {
            type: Sequelize.DATEONLY,
          },
          phanTram: {
            type: Sequelize.DECIMAL(5, 2),
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        'nghienCuu',
        {
          maDeTai: buildIdColumn(Sequelize, { primaryKey: true }),
          tenDeTai: buildStringColumn(Sequelize),
          capDeTai: buildStringColumn(Sequelize),
          phanLoai: buildStringColumn(Sequelize),
          donVi: buildStringColumn(Sequelize),
          kinhPhi: {
            type: Sequelize.DECIMAL(18, 2),
          },
          thoiGianBatDau: {
            type: Sequelize.DATEONLY,
          },
          thoiGianKetThuc: {
            type: Sequelize.DATEONLY,
          },
          moTa: buildTextColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'sinhVien_NghienCuu',
        {
          MSV: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'sinhVien',
              key: 'MSV',
            },
          },
          maDeTai: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'nghienCuu',
              key: 'maDeTai',
            },
          },
          MCB: {
            ...buildIdColumn(Sequelize),
            references: {
              model: 'canBo',
              key: 'MCB',
            },
          },
          ngayThamGia: {
            type: Sequelize.DATEONLY,
          },
          trangThai: buildStringColumn(Sequelize),
          moTa: buildTextColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'doAnTN',
        {
          maDoAn: buildIdColumn(Sequelize, { primaryKey: true }),
          tenDoAn: buildStringColumn(Sequelize),
          trangThai: buildStringColumn(Sequelize),
          diem: {
            type: Sequelize.FLOAT,
          },
          ngayBatDau: {
            type: Sequelize.DATEONLY,
          },
          ngayBaoVe: {
            type: Sequelize.DATEONLY,
          },
          bacDoAn: buildStringColumn(Sequelize),
          moTa: buildTextColumn(Sequelize),
          dinhKem: buildTextColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'sinhVien_DoAnTN',
        {
          MSV: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'sinhVien',
              key: 'MSV',
            },
          },
          maDoAn: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'doAnTN',
              key: 'maDoAn',
            },
          },
          ngayDangKy: {
            type: Sequelize.DATEONLY,
          },
          trangThai: buildStringColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'duHoc',
        {
          maSuat: buildIdColumn(Sequelize, { primaryKey: true }),
          tenChuongTrinh: buildStringColumn(Sequelize),
          loaiHinh: buildStringColumn(Sequelize),
          hocBong: {
            type: Sequelize.BOOLEAN,
          },
          donVi: buildStringColumn(Sequelize),
          chuyenNganh: buildStringColumn(Sequelize),
          kinhPhiTaiTro: {
            type: Sequelize.DECIMAL(18, 2),
          },
          bac: buildStringColumn(Sequelize),
          namBatDau: {
            type: Sequelize.INTEGER,
          },
          namKetThuc: {
            type: Sequelize.INTEGER,
          },
          dieuKien: buildTextColumn(Sequelize),
          trangThai: buildStringColumn(Sequelize),
          quocGiaTheoHoc: buildStringColumn(Sequelize),
          donViTheoHoc: buildStringColumn(Sequelize),
          moTa: buildTextColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'sinhVien_DuHoc',
        {
          MSV: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'sinhVien',
              key: 'MSV',
            },
          },
          maSuat: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'duHoc',
              key: 'maSuat',
            },
          },
          ngayDangKy: {
            type: Sequelize.DATEONLY,
          },
          phanTram: {
            type: Sequelize.DECIMAL(5, 2),
          },
          trangThai: buildStringColumn(Sequelize),
        },
        { transaction }
      );

      await queryInterface.createTable(
        'suKien',
        {
          maSuKien: buildIdColumn(Sequelize, { primaryKey: true }),
          tenSuKien: buildStringColumn(Sequelize),
          donViToChuc: buildStringColumn(Sequelize),
          soLuongThamGia: {
            type: Sequelize.INTEGER,
          },
          diaDiem: buildStringColumn(Sequelize),
          thoiGianBatDau: {
            type: Sequelize.DATE,
          },
          thoiGianKetThuc: {
            type: Sequelize.DATE,
          },
          trangThai: buildStringColumn(Sequelize),
          moTa: buildTextColumn(Sequelize),
          loaiSuKien: buildStringColumn(Sequelize),
          batBuoc: {
            type: Sequelize.BOOLEAN,
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        'sinhVien_SuKien',
        {
          MSV: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'sinhVien',
              key: 'MSV',
            },
          },
          maSuKien: {
            ...buildIdColumn(Sequelize, { primaryKey: true }),
            references: {
              model: 'suKien',
              key: 'maSuKien',
            },
          },
          trangThai: buildStringColumn(Sequelize),
        },
        { transaction }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('sinhVien_SuKien', { transaction });
      await queryInterface.dropTable('suKien', { transaction });
      await queryInterface.dropTable('sinhVien_DuHoc', { transaction });
      await queryInterface.dropTable('duHoc', { transaction });
      await queryInterface.dropTable('sinhVien_DoAnTN', { transaction });
      await queryInterface.dropTable('doAnTN', { transaction });
      await queryInterface.dropTable('sinhVien_NghienCuu', { transaction });
      await queryInterface.dropTable('nghienCuu', { transaction });
      await queryInterface.dropTable('sinhVien_HocBong', { transaction });
      await queryInterface.dropTable('hocBong', { transaction });
      await queryInterface.dropTable('sinhVien_LopTinChi', { transaction });
      await queryInterface.dropTable('sinhVien_LopHanhChinh', { transaction });
      await queryInterface.dropTable('lopTinChi', { transaction });
      await queryInterface.dropTable('lopHanhChinh', { transaction });
      await queryInterface.dropTable('bangDiem', { transaction });
      await queryInterface.dropTable('monDaoTao', { transaction });
      await queryInterface.dropTable('mon', { transaction });
      await queryInterface.dropTable('chuyenNganh', { transaction });
      await queryInterface.dropTable('chuongTrinhDaoTao', { transaction });
      await queryInterface.dropTable('bac', { transaction });
      await queryInterface.dropTable('heDaoTao', { transaction });
      await queryInterface.dropTable('sinhVien', { transaction });
      await queryInterface.dropTable('Khoa', { transaction });
      await queryInterface.dropTable('canBo', { transaction });
      await queryInterface.dropTable('ttcn', { transaction });
    });
  },
};
