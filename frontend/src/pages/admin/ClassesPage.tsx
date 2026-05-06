import { AdminCrudPage } from './AdminCrudPage';
import { TRANG_THAI_LOP } from '@qldh/shared';

export function AdminClassesPage() {
  const currentYear = new Date().getFullYear();
  const kyDaoTaoOptions = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear - 2 + Math.floor(i / 2);
    const semester = (i % 2) + 1;
    return `HK${semester}-${year}`;
  });

  return (
    <AdminCrudPage
      table="lopTinChi"
      title="Quản lý Lớp tín chỉ"
      description="Mở lớp, phân công giảng viên, quản lý sĩ số"
      columns={[
        { key: 'maLop', label: 'Mã lớp', pk: true, required: true },
        { key: 'MCB', label: 'Giảng viên (MCB)', required: true, fk: { table: 'canBo', valueKey: 'MCB', displayKey: 'MCB' } },
        { key: 'maMon', label: 'Mã môn', required: true, fk: { table: 'mon', valueKey: 'maMon', displayKey: 'tenMon' } },
        { key: 'kyDaoTao', label: 'Kỳ đào tạo', type: 'select', options: kyDaoTaoOptions, required: true },
        { key: 'soLuongSinhVienMax', label: 'SV tối đa', type: 'number', min: 10, max: 200, required: true },
        { key: 'soLuongSinhVien', label: 'SV hiện tại', type: 'number', min: 0, max: 200 },
        { key: 'trangThai', label: 'Trạng thái', type: 'select', options: [...TRANG_THAI_LOP], required: true },
      ]}
    />
  );
}
