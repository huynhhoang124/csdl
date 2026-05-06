import { AdminCrudPage } from './AdminCrudPage';

export function AdminProgramsPage() {
  return (
    <AdminCrudPage
      table="chuyenNganh"
      title="Quản lý Chuyên ngành"
      description="Quản lý các chuyên ngành đào tạo"
      columns={[
        { key: 'maChuyenNganh', label: 'Mã CN', pk: true },
        { key: 'maKhoa', label: 'Khoa' },
        { key: 'maHe', label: 'Hệ ĐT' },
        { key: 'maBac', label: 'Bậc' },
        { key: 'tenChuyenNganh', label: 'Tên chuyên ngành' },
        { key: 'soTinChi', label: 'Số tín chỉ' },
      ]}
    />
  );
}
