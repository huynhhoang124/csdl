import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-display font-bold text-slate-300 dark:text-slate-700">404</h1>
        <p className="text-slate-500">Không tìm thấy trang</p>
        <Link to="/"><Button>Về trang chủ</Button></Link>
      </div>
    </div>
  );
}
