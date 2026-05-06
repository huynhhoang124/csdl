import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { http } from '@/lib/api/adapters/rest/httpClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function TeacherThesisPage() {
  const MCB = useAuthStore(s => s.user?.MCB);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['teacher-thesis', MCB],
    queryFn: async () => (await http.get(`/teachers/${MCB}/thesis`)).data,
    enabled: !!MCB
  });

  const updateMut = useMutation({
    mutationFn: async ({ maDoAn, diem, trangThai }: any) => await http.put(`/teachers/${MCB}/thesis/${maDoAn}`, { diem, trangThai }),
    onSuccess: () => {
      toast.success('Đã cập nhật đồ án!');
      qc.invalidateQueries({ queryKey: ['teacher-thesis', MCB] });
    },
    onError: () => toast.error('Lỗi cập nhật đồ án')
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Đồ án hướng dẫn</h1>
        <p className="text-slate-500">Danh sách đồ án tốt nghiệp hiện tại (Phiên bản thử nghiệm)</p>
      </div>

      {isLoading ? <p className="text-slate-500">Đang tải danh sách đồ án...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.items.map((t: any) => (
            <Card key={t.maDoAn} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">{t.tenDoAn}</CardTitle>
                <CardDescription>Mã ĐA: <code>{t.maDoAn}</code></CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="size-4 text-slate-400" />
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs',
                    t.trangThai === 'Hoan thanh' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  )}>{t.trangThai || 'Dang thuc hien'}</span>
                </div>
                <div className="text-sm text-slate-500 line-clamp-2">{t.moTa || 'Chưa có mô tả chi tiết'}</div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sinh viên thực hiện:</p>
                  <div className="space-y-1">
                    {t.sinhVien_doAnTNs?.map((link: any) => (
                      <div key={link.MSV} className="text-sm flex justify-between">
                        <span>{link.sinhVien?.ttcn ? `${link.sinhVien.ttcn.Ho} ${link.sinhVien.ttcn.Ten}` : link.MSV}</span>
                        <code className="text-xs text-slate-400">{link.MSV}</code>
                      </div>
                    ))}
                    {(!t.sinhVien_doAnTNs || t.sinhVien_doAnTNs.length === 0) && <p className="text-xs text-slate-400 italic">Chưa có sinh viên</p>}
                  </div>
                </div>

                {t.diem != null && <p className="text-sm font-semibold text-emerald-600 mt-2">Điểm: {t.diem}</p>}
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-4"
                  disabled={updateMut.isPending}
                  onClick={() => {
                    const diem = prompt('Nhập điểm đồ án (0-10):', t.diem ?? '');
                    if (diem != null && diem.trim() !== '') {
                      updateMut.mutate({ maDoAn: t.maDoAn, diem: Number(diem), trangThai: 'Hoàn thành' });
                    }
                  }}
                >
                  Chấm điểm
                </Button>
              </CardContent>
            </Card>
          ))}
          {!data?.items.length && <p className="text-slate-500">Không có đồ án nào được tìm thấy.</p>}
        </div>
      )}
    </div>
  );
}
