import { AdminCrudPage } from './AdminCrudPage';

export function AdminPersonalPage() {
  return (
    <AdminCrudPage
      table="ttcn"
      title="Quản lý Hồ sơ Cá nhân"
      description="Quản lý thông tin cá nhân cơ bản của toàn bộ Cán bộ và Sinh viên"
      columns={[
        { key: 'CCCD', label: 'CCCD', pk: true, required: true, validate: (v) => /^\d{9,12}$/.test(String(v)) ? undefined : 'CCCD phải có 9-12 số' },
        { key: 'hoTen', label: 'Họ và tên', required: true },
        { key: 'vaiTro', label: 'Vai trò', type: 'select', options: ['Sinh vien', 'Giang vien', 'Can bo', 'Admin'], required: true },
        { key: 'matKhau', label: 'Mật khẩu', required: true, hiddenInList: true },
        { key: 'ngaySinh', label: 'Ngày sinh', type: 'date', required: true },
        { key: 'gioiTinh', label: 'Giới tính', type: 'select', options: ['Nam', 'Nu'] },
        { key: 'email', label: 'Email', validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) ? undefined : 'Email không hợp lệ' },
        { key: 'soDienThoai', label: 'SĐT', validate: (v) => !v || /^\d{10,11}$/.test(String(v)) ? undefined : 'SĐT phải có 10-11 số' },
        { key: 'queQuan', label: 'Quê quán', hiddenInList: true },
        { key: 'noiO', label: 'Nơi ở', hiddenInList: true },
        { key: 'danToc', label: 'Dân tộc', hiddenInList: true },
        { key: 'tonGiao', label: 'Tôn giáo', hiddenInList: true },
        { key: 'baoHiem', label: 'Mã BHYT', hiddenInList: true },
      ]}
    />
  );
}
