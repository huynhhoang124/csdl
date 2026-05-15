'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // I1: Lọc vai trò khi đăng nhập
      await queryInterface.addIndex('ttcn', ['vaiTro'], {
        name: 'IX_ttcn_vaiTro',
        transaction,
      });

      // I2: Thống kê trạng thái SV
      await queryInterface.addIndex('sinhVien', ['trangThai'], {
        name: 'IX_sinhVien_trangThai',
        transaction,
      });

      // I3: Phân loại GPA cho biểu đồ
      await queryInterface.addIndex('sinhVien', ['GPA'], {
        name: 'IX_sinhVien_GPA',
        transaction,
      });

      // I4: Lọc SV theo khoa (FK không tự tạo index trên SQL Server)
      await queryInterface.addIndex('sinhVien', ['maKhoa'], {
        name: 'IX_sinhVien_maKhoa',
        transaction,
      });

      // I5: Lớp theo giảng viên
      await queryInterface.addIndex('lopTinChi', ['MCB'], {
        name: 'IX_lopTinChi_MCB',
        transaction,
      });

      // I6: Lớp theo môn
      await queryInterface.addIndex('lopTinChi', ['maMon'], {
        name: 'IX_lopTinChi_maMon',
        transaction,
      });

      // I7: Lọc lớp theo trạng thái đăng ký
      await queryInterface.addIndex('lopTinChi', ['trangThai'], {
        name: 'IX_lopTinChi_trangThai',
        transaction,
      });

      // I8: Điểm theo sinh viên (tần suất cao)
      await queryInterface.addIndex('bangDiem', ['MSV'], {
        name: 'IX_bangDiem_MSV',
        transaction,
      });

      // I9: Điểm theo môn
      await queryInterface.addIndex('bangDiem', ['maMon'], {
        name: 'IX_bangDiem_maMon',
        transaction,
      });

      // I10: Đề tài theo GV hướng dẫn
      await queryInterface.addIndex('sinhVien_NghienCuu', ['MCB'], {
        name: 'IX_sinhVien_NghienCuu_MCB',
        transaction,
      });

      // I11: Cán bộ → TTCN
      await queryInterface.addIndex('canBo', ['CCCD'], {
        name: 'IX_canBo_CCCD',
        transaction,
      });

      // I12: Chuyên ngành theo khoa
      await queryInterface.addIndex('chuyenNganh', ['maKhoa'], {
        name: 'IX_chuyenNganh_maKhoa',
        transaction,
      });

      // I13: Môn theo khoa
      await queryInterface.addIndex('mon', ['maKhoa'], {
        name: 'IX_mon_maKhoa',
        transaction,
      });

      // I14: Lớp HC theo chuyên ngành
      await queryInterface.addIndex('lopHanhChinh', ['maChuyenNganh'], {
        name: 'IX_lopHanhChinh_maChuyenNganh',
        transaction,
      });

      // I15: Sự kiện theo trạng thái
      await queryInterface.addIndex('suKien', ['trangThai'], {
        name: 'IX_suKien_trangThai',
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const indexes = [
        ['ttcn', 'IX_ttcn_vaiTro'],
        ['sinhVien', 'IX_sinhVien_trangThai'],
        ['sinhVien', 'IX_sinhVien_GPA'],
        ['sinhVien', 'IX_sinhVien_maKhoa'],
        ['lopTinChi', 'IX_lopTinChi_MCB'],
        ['lopTinChi', 'IX_lopTinChi_maMon'],
        ['lopTinChi', 'IX_lopTinChi_trangThai'],
        ['bangDiem', 'IX_bangDiem_MSV'],
        ['bangDiem', 'IX_bangDiem_maMon'],
        ['sinhVien_NghienCuu', 'IX_sinhVien_NghienCuu_MCB'],
        ['canBo', 'IX_canBo_CCCD'],
        ['chuyenNganh', 'IX_chuyenNganh_maKhoa'],
        ['mon', 'IX_mon_maKhoa'],
        ['lopHanhChinh', 'IX_lopHanhChinh_maChuyenNganh'],
        ['suKien', 'IX_suKien_trangThai'],
      ];
      for (const [table, name] of indexes) {
        await queryInterface.removeIndex(table, name, { transaction });
      }
    });
  },
};
