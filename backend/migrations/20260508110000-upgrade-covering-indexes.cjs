'use strict';

/**
 * Nâng cấp các index thường bị Key Lookup thành Covering Index
 * bằng cách thêm INCLUDE cho các cột được SELECT.
 * Sequelize addIndex không hỗ trợ INCLUDE nên dùng raw SQL.
 */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Xóa index cũ không INCLUDE
      await queryInterface.removeIndex('bangDiem', 'IX_bangDiem_MSV', { transaction });
      await queryInterface.removeIndex('lopTinChi', 'IX_lopTinChi_MCB', { transaction });

      // I8: Covering index cho bangDiem — API /students/:MSV/grades SELECT tất cả cột
      // PK = (maMon, MSV), index key = MSV → maMon đã nằm trong clustered key
      // Cần INCLUDE thêm diemSo, diemChu để tránh Key Lookup
      await queryInterface.sequelize.query(`
        CREATE NONCLUSTERED INDEX [IX_bangDiem_MSV]
        ON [bangDiem] ([MSV])
        INCLUDE ([diemSo], [diemChu])
      `, { transaction });

      // I5: Covering index cho lopTinChi — API /teachers/:MCB/classes SELECT tất cả cột
      // PK = maLop (clustered key), index key = MCB
      // Cần INCLUDE thêm maMon, kyDaoTao, trangThai, soLuongSinhVienMax, soLuongSinhVien
      await queryInterface.sequelize.query(`
        CREATE NONCLUSTERED INDEX [IX_lopTinChi_MCB]
        ON [lopTinChi] ([MCB])
        INCLUDE ([maMon], [kyDaoTao], [trangThai], [soLuongSinhVienMax], [soLuongSinhVien])
      `, { transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Xóa covering index
      await queryInterface.removeIndex('bangDiem', 'IX_bangDiem_MSV', { transaction });
      await queryInterface.removeIndex('lopTinChi', 'IX_lopTinChi_MCB', { transaction });

      // Tạo lại index đơn giản (không INCLUDE)
      await queryInterface.addIndex('bangDiem', ['MSV'], {
        name: 'IX_bangDiem_MSV', transaction,
      });
      await queryInterface.addIndex('lopTinChi', ['MCB'], {
        name: 'IX_lopTinChi_MCB', transaction,
      });
    });
  },
};
