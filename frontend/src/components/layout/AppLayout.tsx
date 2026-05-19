import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LayoutDashboard, BookOpen, GraduationCap, Award, FlaskConical,
  FileText, Plane, Calendar, Users, Database, Settings2, LogOut, Menu, X,
  Network, FlaskRound, Building2, Layers, School, ClipboardList, Trophy,
  ShieldCheck,
} from 'lucide-react';
import type { Role } from '@qldh/shared';
import { useAuthStore } from '@/store/authStore';
import { getBackendMode, setBackendMode, type BackendMode } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavItem { to: string; icon: React.ReactNode; label: string }

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  student: [
    { to: '/student', icon: <LayoutDashboard className="size-5" />, label: 'Tổng quan' },
    { to: '/student/grades', icon: <BookOpen className="size-5" />, label: 'Bảng điểm' },
    { to: '/student/register', icon: <GraduationCap className="size-5" />, label: 'Đăng ký lớp' },
    { to: '/student/scholarships', icon: <Award className="size-5" />, label: 'Học bổng' },
    { to: '/student/research', icon: <FlaskConical className="size-5" />, label: 'NCKH' },
    { to: '/student/thesis', icon: <FileText className="size-5" />, label: 'Đồ án TN' },
    { to: '/student/overseas', icon: <Plane className="size-5" />, label: 'Du học' },
    { to: '/student/events', icon: <Calendar className="size-5" />, label: 'Sự kiện' },
  ],
  teacher: [
    { to: '/teacher', icon: <LayoutDashboard className="size-5" />, label: 'Tổng quan' },
    { to: '/teacher/classes', icon: <Users className="size-5" />, label: 'Lớp phụ trách' },
    { to: '/teacher/grades', icon: <BookOpen className="size-5" />, label: 'Nhập điểm' },
    { to: '/teacher/thesis', icon: <FileText className="size-5" />, label: 'Đồ án hướng dẫn' },
    { to: '/teacher/research', icon: <FlaskConical className="size-5" />, label: 'Đề tài NCKH' },
  ],
  admin: [
    { to: '/admin', icon: <LayoutDashboard className="size-5" />, label: 'Tổng quan' },
    { to: '/admin/personal', icon: <Users className="size-5" />, label: 'Hồ sơ cá nhân' },
    { to: '/admin/students', icon: <GraduationCap className="size-5" />, label: 'Sinh viên' },
    { to: '/admin/teachers', icon: <Users className="size-5" />, label: 'Giảng viên / CB' },
    { to: '/admin/departments', icon: <Building2 className="size-5" />, label: 'Khoa' },
    { to: '/admin/programs', icon: <Layers className="size-5" />, label: 'Chuyên ngành' },
    { to: '/admin/training-programs', icon: <ClipboardList className="size-5" />, label: 'CTĐT' },
    { to: '/admin/courses', icon: <BookOpen className="size-5" />, label: 'Môn học' },
    { to: '/admin/classes', icon: <School className="size-5" />, label: 'Lớp tín chỉ' },
    { to: '/admin/grades', icon: <FileText className="size-5" />, label: 'Bảng điểm' },
    { to: '/admin/scholarships', icon: <Trophy className="size-5" />, label: 'Học bổng' },
  ]
};

const ROLE_LABELS: Record<Role, string> = {
  student: 'Sinh viên',
  teacher: 'Giảng viên',
  admin: 'Quản trị viên'
};

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [backendMode, setMode] = useState<BackendMode>(getBackendMode());

  if (!user) return null;
  const nav = NAV_BY_ROLE[user.role] ?? NAV_BY_ROLE.student;

  const handleLogout = async () => {
    await logout();
    toast.success('Đã đăng xuất');
    navigate('/', { replace: true });
  };

  const handleBackendChange = (mode: BackendMode) => {
    setMode(mode);
    toast.info(`Chuyển sang backend: ${mode}. Đang tải lại...`);
    setTimeout(() => setBackendMode(mode), 300);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20 overflow-hidden'
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <div className="size-8 rounded-lg bg-brand-gradient" />
            {sidebarOpen && <span>QLDH</span>}
          </Link>
        </div>
        {sidebarOpen && user.role === 'admin' && (
          <div className="mx-3 mt-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="size-4" />
              Phòng Đào tạo
            </div>
          </div>
        )}
        <nav className="p-3 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${user.role}`}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition',
                  isActive
                    ? 'bg-brand-gradient text-white shadow-md'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                )
              }
              title={item.label}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen((v) => !v)}>
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
          <div className="flex-1" />

          <ThemeToggle />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.displayName}</p>
              <p className="text-xs text-slate-500">{ROLE_LABELS[user.role] ?? user.role}</p>
            </div>
            <div className={cn(
              'size-10 rounded-full text-white flex items-center justify-center font-semibold shadow',
              user.role === 'admin' ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-brand-gradient'
            )}>
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Đăng xuất">
              <LogOut className="size-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
