/**
 * Minimal i18n — chỉ để sẵn cấu trúc, hiện dùng tiếng Việt làm default.
 * Mở rộng sau bằng react-i18next nếu cần đa ngôn ngữ thực sự.
 */
type Dict = Record<string, string>;

const vi: Dict = {
  welcome: 'Xin chào',
  dashboard: 'Tổng quan',
  grades: 'Bảng điểm',
  register_class: 'Đăng ký lớp',
  logout: 'Đăng xuất',
  save: 'Lưu',
  cancel: 'Hủy',
  delete: 'Xóa',
  edit: 'Sửa',
  create: 'Tạo mới',
  search: 'Tìm kiếm',
  loading: 'Đang tải...',
  no_data: 'Không có dữ liệu',
};

const en: Dict = {
  welcome: 'Welcome',
  dashboard: 'Dashboard',
  grades: 'Grades',
  register_class: 'Register Class',
  logout: 'Logout',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  create: 'Create',
  search: 'Search',
  loading: 'Loading...',
  no_data: 'No data',
};

const DICTS: Record<string, Dict> = { vi, en };

export type Locale = 'vi' | 'en';

let currentLocale: Locale = (localStorage.getItem('qldh:locale') as Locale) || 'vi';

export function t(key: string): string {
  return DICTS[currentLocale]?.[key] ?? DICTS.vi![key] ?? key;
}

export function setLocale(l: Locale) {
  currentLocale = l;
  localStorage.setItem('qldh:locale', l);
  window.location.reload();
}

export function getLocale(): Locale {
  return currentLocale;
}
