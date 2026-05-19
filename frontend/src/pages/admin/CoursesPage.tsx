import { AdminCrudPage } from './AdminCrudPage';
import { KIEU_MON_HOC } from '@qldh/shared';

export function AdminCoursesPage() {
  return (
    <AdminCrudPage
      table="mon"
      title="Quản lý Môn học"
      description="Quản lý danh sách môn học trong chương trình đào tạo"
      columns={[
        { key: 'maMon', label: 'Mã môn', pk: true, required: true },
        { key: 'maKhoa', label: 'Khoa', required: true, fk: { table: 'Khoa', valueKey: 'maKhoa', displayKey: 'tenKhoa' } },
        { key: 'tenMon', label: 'Tên môn', required: true },
        { key: 'kieuMonHoc', label: 'Loại', type: 'select', options: [...KIEU_MON_HOC], required: true },
        { key: 'moTa', label: 'Mô tả', hiddenInList: true },
      ]}
    />
  );
}
