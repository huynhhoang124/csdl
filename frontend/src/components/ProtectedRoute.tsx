import { Navigate, useLocation } from 'react-router-dom';
import type { Role } from '@qldh/shared';
import { useAuthStore } from '@/store/authStore';

interface Props {
  role: Role;
  children: React.ReactNode;
}

export function ProtectedRoute({ role, children }: Props) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const location = useLocation();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Dang tai phien dang nhap...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login/${role}`} state={{ from: location }} replace />;
  }
  if (user.role !== role && user.role !== 'admin') {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return <>{children}</>;
}
