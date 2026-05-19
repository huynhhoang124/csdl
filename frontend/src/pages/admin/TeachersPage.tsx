import { AdminCrudPage } from './AdminCrudPage';
import { TRANG_THAI_CAN_BO } from '@qldh/shared';

export function AdminTeachersPage() {
  return (
    <AdminCrudPage
      table="canBo"
      title="Quản lý Giảng viên / Cán bộ"
      description="Thêm, sửa, xóa thông tin cán bộ và giảng viên"
      columns={[
        { key: 'MCB', label: 'Mã CB', pk: true, required: true },
        { key: 'CCCD', label: 'CCCD', required: true, fk: { table: 'ttcn', valueKey: 'CCCD', displayKey: 'hoTen' } },
        { key: 'viTriCongViec', label: 'Vị trí', type: 'select', options: ['Giang vien', 'Truong khoa', 'Admin'], required: true },
        { key: 'trangThai', label: 'Trạng thái', type: 'select', options: [...TRANG_THAI_CAN_BO], required: true },
      ]}
      importUpsert
    />
  );
}
