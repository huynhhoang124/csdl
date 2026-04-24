import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { repositories } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function RegisterPage() {
  const MSV = useAuthStore((s) => s.user?.MSV) ?? '';
  const qc = useQueryClient();

  const { data: classesPage } = useQuery({
    queryKey: ['credit-classes'],
    queryFn: () => repositories.class.creditClasses.list({ pageSize: 100 }),
  });
  const classes = classesPage?.items ?? [];

  const { data: myRegs = [] } = useQuery({
    queryKey: ['my-regs', MSV],
    queryFn: () => repositories.class.listRegistrations(MSV),
    enabled: !!MSV,
  });

  const register = useMutation({
    mutationFn: (maLop: string) => repositories.class.registerCreditClass(MSV, maLop),
    onSuccess: () => {
      toast.success('Đăng ký thành công!');
      qc.invalidateQueries({ queryKey: ['my-regs', MSV] });
      qc.invalidateQueries({ queryKey: ['credit-classes'] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Đăng ký thất bại'),
  });

  const unregister = useMutation({
    mutationFn: (maLop: string) => repositories.class.unregisterCreditClass(MSV, maLop),
    onSuccess: () => {
      toast.success('Đã hủy đăng ký');
      qc.invalidateQueries({ queryKey: ['my-regs', MSV] });
      qc.invalidateQueries({ queryKey: ['credit-classes'] });
    },
  });

  const regSet = new Set(myRegs.map((r) => r.maLop));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Đăng ký lớp tín chỉ</h1>
      <p className="text-slate-500">Đã đăng ký: <strong>{myRegs.length}</strong> lớp</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((c) => {
          const registered = regSet.has(c.maLop);
          const full = (c.soLuongSinhVien ?? 0) >= (c.soLuongSinhVienMax ?? 0);
          return (
            <Card key={c.maLop} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="font-mono text-base">{c.maLop}</span>
                  {registered && <CheckCircle2 className="size-5 text-emerald-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Môn: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{c.maMon}</code></p>
                <p className="text-sm">Kỳ: <strong>{c.kyDaoTao}</strong></p>
                <p className="text-sm">
                  Sĩ số: <span className={full ? 'text-rose-600 font-semibold' : 'text-emerald-600'}>
                    {c.soLuongSinhVien}/{c.soLuongSinhVienMax}
                  </span>
                </p>
                <p className="text-xs text-slate-500">Trạng thái: {c.trangThai}</p>
                {registered ? (
                  <Button variant="outline" className="w-full" onClick={() => unregister.mutate(c.maLop)}>
                    Hủy đăng ký
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    disabled={full || register.isPending}
                    onClick={() => register.mutate(c.maLop)}
                  >
                    {full ? <><AlertCircle className="size-4" /> Lớp đầy</> : 'Đăng ký'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
