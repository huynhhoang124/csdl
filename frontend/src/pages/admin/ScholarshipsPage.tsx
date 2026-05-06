import { AdminCrudPage } from './AdminCrudPage';

export function AdminScholarshipsPage() {
  return (
    <AdminCrudPage
      table="hocBong"
      title="Quản lý Học bổng"
      description="Quản lý danh sách học bổng và điều kiện xét duyệt"
      columns={[
        { key: 'maHocBong', label: 'Mã HB', pk: true },
        { key: 'tenHocBong', label: 'Tên học bổng' },
        { key: 'loaiHocBong', label: 'Loại' },
        { key: 'giaTri', label: 'Giá trị (VNĐ)' },
        { key: 'donViCungCap', label: 'Đơn vị cung cấp' },
        { key: 'dieuKien', label: 'Điều kiện' },
      ]}
    />
  );
}
