import { AdminCrudPage } from './AdminCrudPage';
import { TRANG_THAI_SINH_VIEN } from '@qldh/shared';

export function AdminStudentsPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear - 5 + i));

  return (
    <AdminCrudPage
      table="sinhVien"
      title="Quản lý Sinh viên"
      description="Thêm, sửa, xóa và tra cứu thông tin sinh viên"
      columns={[
        { key: 'MSV', label: 'Mã SV', pk: true, required: true },
        { key: 'CCCD', label: 'CCCD', required: true, fk: { table: 'ttcn', valueKey: 'CCCD', displayKey: 'hoTen' } },
        { key: 'trangThai', label: 'Trạng thái', type: 'select', options: [...TRANG_THAI_SINH_VIEN], required: true },
        { key: 'namHoc', label: 'Năm học', type: 'select', options: years, required: true },
        { key: 'khoaDaoTao', label: 'Khóa đào tạo' },
        { key: 'GPA', label: 'GPA', type: 'number', min: 0, max: 4.0, step: '0.01' },
        { key: 'CPA', label: 'CPA', type: 'number', min: 0, max: 4.0, step: '0.01' },
      ]}
      importUpsert
    />
  );
}
