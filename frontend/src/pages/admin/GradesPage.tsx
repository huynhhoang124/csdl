import { AdminCrudPage } from './AdminCrudPage';
import { DIEM_CHU } from '@qldh/shared';

export function AdminGradesPage() {
  return (
    <AdminCrudPage
      table="bangDiem"
      title="Quản lý Bảng điểm"
      description="Xem và quản lý điểm số sinh viên"
      columns={[
        { key: 'maMon', label: 'Mã môn', pk: true, required: true, fk: { table: 'mon', valueKey: 'maMon', displayKey: 'tenMon' } },
        { key: 'MSV', label: 'Mã SV', pk: true, required: true, fk: { table: 'sinhVien', valueKey: 'MSV', displayKey: 'MSV' } },
        { key: 'diemSo', label: 'Điểm số (Hệ 10)', type: 'number', min: 0, max: 10, step: '0.1', required: true },
        { key: 'diemChu', label: 'Điểm chữ', type: 'select', options: [...DIEM_CHU], required: true },
      ]}
    />
  );
}
