import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { http } from '@/lib/api/adapters/rest/httpClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical } from 'lucide-react';
import { toast } from 'sonner';

export function TeacherResearchPage() {
  const MCB = useAuthStore(s => s.user?.MCB);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['teacher-research', MCB],
    queryFn: async () => (await http.get(`/teachers/${MCB}/research`)).data,
    enabled: !!MCB
  });

  const updateMut = useMutation({
    mutationFn: async ({ maDeTai, moTa }: any) => await http.put(`/teachers/${MCB}/research/${maDeTai}`, { moTa }),
    onSuccess: () => {
      toast.success('Đã cập nhật tiến độ!');
      qc.invalidateQueries({ queryKey: ['teacher-research', MCB] });
    },
    onError: () => toast.error('Lỗi cập nhật tiến độ')
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Nghiên cứu khoa học</h1>
        <p className="text-slate-500">Danh sách đề tài NCKH (Phiên bản thử nghiệm)</p>
      </div>

      {isLoading ? <p className="text-slate-500">Đang tải danh sách đề tài...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.items.map((r: any) => (
            <Card key={r.maDeTai} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">{r.tenDeTai}</CardTitle>
                <CardDescription>Mã ĐT: <code>{r.maDeTai}</code></CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FlaskConical className="size-4 text-slate-400" />
                  <span>Cấp: <strong>{r.capDeTai || 'Cơ sở'}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Kinh phí: {r.kinhPhi ? Number(r.kinhPhi).toLocaleString() + ' đ' : 'Chưa cấp'}</span>
                </div>
                <div className="text-sm text-slate-500 line-clamp-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {r.moTa || 'Chưa có mô tả chi tiết'}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sinh viên tham gia:</p>
                  <div className="space-y-1">
                    {r.sinhVien_nghienCuus?.map((link: any) => (
                      <div key={link.MSV} className="text-sm flex justify-between">
                        <span>{link.sinhVien?.ttcn ? `${link.sinhVien.ttcn.Ho} ${link.sinhVien.ttcn.Ten}` : link.MSV}</span>
                        <code className="text-xs text-slate-400">{link.MSV}</code>
                      </div>
                    ))}
                    {(!r.sinhVien_nghienCuus || r.sinhVien_nghienCuus.length === 0) && <p className="text-xs text-slate-400 italic">Chưa có sinh viên</p>}
                  </div>
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-4"
                  disabled={updateMut.isPending}
                  onClick={() => {
                    const moTa = prompt('Cập nhật tiến độ (Mô tả chi tiết):', r.moTa ?? '');
                    if (moTa != null && moTa.trim() !== '') {
                      updateMut.mutate({ maDeTai: r.maDeTai, moTa });
                    }
                  }}
                >
                  Cập nhật tiến độ
                </Button>
              </CardContent>
            </Card>
          ))}
          {!data?.items.length && <p className="text-slate-500">Không có đề tài NCKH nào được tìm thấy.</p>}
        </div>
      )}
    </div>
  );
}
