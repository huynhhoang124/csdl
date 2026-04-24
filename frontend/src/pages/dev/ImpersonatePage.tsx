import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { repositories } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ImpersonatePage() {
  const impersonate = useAuthStore((s) => s.impersonate);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: svPage } = useQuery({
    queryKey: ['sv-impersonate', search],
    queryFn: () => repositories.student.list({ search, pageSize: 20 }),
  });
  const { data: cbPage } = useQuery({
    queryKey: ['cb-impersonate', search],
    queryFn: () => repositories.teacher.list({ search, pageSize: 20 }),
  });

  const go = async (id: string, role: 'student' | 'teacher') => {
    try {
      await impersonate(id);
      toast.success(`Đăng nhập với vai trò ${role}: ${id}`);
      navigate(`/${role}`, { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Thất bại');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Impersonate User</h1>
        <p className="text-slate-500">Đăng nhập với tư cách bất kỳ SV/CB để test giao diện</p>
      </div>
      <Input placeholder="Tìm theo MSV / MCB / tên..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Sinh viên ({svPage?.total ?? 0})</CardTitle></CardHeader>
          <CardContent className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
            {svPage?.items.map((sv) => (
              <div key={sv.MSV} className="py-2 flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-mono">{sv.MSV}</span>
                  <span className="text-slate-400 ml-2">GPA: {sv.GPA?.toFixed(2)}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => go(sv.MSV, 'student')}>Đăng nhập →</Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Cán bộ ({cbPage?.total ?? 0})</CardTitle></CardHeader>
          <CardContent className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
            {cbPage?.items.map((cb) => (
              <div key={cb.MCB} className="py-2 flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-mono">{cb.MCB}</span>
                  <span className="text-slate-400 ml-2">{cb.viTriCongViec}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => go(cb.MCB, 'teacher')}>Đăng nhập →</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
