import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LayoutDashboard, BookOpen, GraduationCap, Award, FlaskConical,
  FileText, Plane, Calendar, Users, Database, Settings2, LogOut, Menu, X,
  Network, FlaskRound,
} from 'lucide-react';
import type { Role } from '@qldh/shared';
import { useAuthStore } from '@/store/authStore';
import { getBackendMode } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavItem { to: string; icon: React.ReactNode; label: string }

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  student: [
    { to: '/student', icon: <LayoutDashboard className="size-5" />, label: 'Tong quan' },
    { to: '/student/grades', icon: <BookOpen className="size-5" />, label: 'Bang diem' },
    { to: '/student/register', icon: <GraduationCap className="size-5" />, label: 'Dang ky lop' },
    { to: '/student/scholarships', icon: <Award className="size-5" />, label: 'Hoc bong' },
    { to: '/student/research', icon: <FlaskConical className="size-5" />, label: 'NCKH' },
    { to: '/student/thesis', icon: <FileText className="size-5" />, label: 'Do an TN' },
    { to: '/student/overseas', icon: <Plane className="size-5" />, label: 'Du hoc' },
    { to: '/student/events', icon: <Calendar className="size-5" />, label: 'Su kien' },
  ],
  teacher: [
    { to: '/teacher', icon: <LayoutDashboard className="size-5" />, label: 'Tong quan' },
    { to: '/teacher/classes', icon: <Users className="size-5" />, label: 'Lop phu trach' },
    { to: '/teacher/grades', icon: <BookOpen className="size-5" />, label: 'Nhap diem' },
    { to: '/teacher/thesis', icon: <FileText className="size-5" />, label: 'Do an huong dan' },
    { to: '/teacher/research', icon: <FlaskConical className="size-5" />, label: 'De tai NCKH' },
  ],
  admin: [
    { to: '/admin', icon: <LayoutDashboard className="size-5" />, label: 'Dashboard' },
    { to: '/admin/tables', icon: <Database className="size-5" />, label: 'CRUD 25 bang' },
    { to: '/admin/playground', icon: <Settings2 className="size-5" />, label: 'API Playground' },
    { to: '/admin/er-diagram', icon: <Network className="size-5" />, label: 'ER Diagram' },
    { to: '/admin/test-runner', icon: <FlaskRound className="size-5" />, label: 'Test Runner' },
    { to: '/admin/impersonate', icon: <Users className="size-5" />, label: 'Impersonate' },
  ],
};

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const backendMode = getBackendMode();

  if (!user) return null;
  const nav = NAV_BY_ROLE[user.role];

  const handleLogout = async () => {
    await logout();
    toast.success('Da dang xuat');
    navigate('/', { replace: true });
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

          {user.role === 'admin' && (
            <div className="hidden md:flex items-center gap-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
              <Database className="size-4 text-slate-400" />
              <span className="text-slate-500">Backend:</span>
              <span className="font-medium">{backendMode} (Luan)</span>
            </div>
          )}

          <ThemeToggle />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.displayName}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
            <div className="size-10 rounded-full bg-brand-gradient text-white flex items-center justify-center font-semibold shadow">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Dang xuat">
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
