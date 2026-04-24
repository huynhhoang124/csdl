import { Navigate, useLocation } from 'react-router-dom';
import type { Role } from '@qldh/shared';
import { useAuthStore } from '@/store/authStore';

interface Props {
  role: Role;
  children: React.ReactNode;
}

export function ProtectedRoute({ role, children }: Props) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/login/${role}`} state={{ from: location }} replace />;
  }
  if (user.role !== role && user.role !== 'dev') {
    // Dev có quyền truy cập mọi portal; role khác thì kick về portal của mình
    return <Navigate to={`/${user.role}`} replace />;
  }
  return <>{children}</>;
}
