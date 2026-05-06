import { AdminCrudPage } from './AdminCrudPage';

export function AdminDepartmentsPage() {
  return (
    <AdminCrudPage
      table="Khoa"
      title="Quản lý Khoa"
      description="Quản lý các khoa trong trường đại học"
      columns={[
        { key: 'maKhoa', label: 'Mã Khoa', pk: true, required: true },
        { key: 'tenKhoa', label: 'Tên khoa', required: true },
        { key: 'MCB', label: 'Trưởng khoa (MCB)', fk: { table: 'canBo', valueKey: 'MCB', displayKey: 'MCB' } },
        { key: 'vanPhongKhoa', label: 'Văn phòng' },
        { key: 'dienThoaiLienHe', label: 'Điện thoại' },
        { key: 'emailLienHe', label: 'Email' },
        { key: 'ngayThanhLap', label: 'Ngày thành lập', type: 'date' },
      ]}
    />
  );
}
