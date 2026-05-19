import { AdminCrudPage } from './AdminCrudPage';

export function AdminTrainingProgramsPage() {
  return (
    <AdminCrudPage
      table="chuongTrinhDaoTao"
      title="Quản lý Chương trình Đào tạo"
      description="Quản lý các chương trình đào tạo chính quy"
      columns={[
        { key: 'maCT', label: 'Mã CT', pk: true },
        { key: 'tenCT', label: 'Tên chương trình' },
        { key: 'tenDonVi', label: 'Đơn vị' },
        { key: 'giamDoc', label: 'Giám đốc', fk: { table: 'canBo', valueKey: 'MCB', displayKey: 'MCB' } },
      ]}
    />
  );
}
