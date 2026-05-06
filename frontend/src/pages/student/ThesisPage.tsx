import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { http } from '@/lib/api/adapters/rest/httpClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Award, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export function ThesisPage() {
  const MSV = useAuthStore((s) => s.user?.MSV) ?? '';
  const qc = useQueryClient();

  const { data: allThesisData } = useQuery({
    queryKey: ['student-all-thesis'],
    queryFn: async () => (await http.get('/students/thesis')).data,
  });
  const allThesis = allThesisData?.items ?? [];

  const { data: myLinksData } = useQuery({
    queryKey: ['my-thesis-links', MSV],
    queryFn: async () => (await http.get(`/students/${MSV}/thesis`)).data,
    enabled: !!MSV,
  });
  const myLinks = myLinksData?.items ?? [];

  const myThesisIds = new Set(myLinks.filter((l: any) => l.MSV === MSV).map((l: any) => String(l.maDoAn)));
  
  const joinMut = useMutation({
    mutationFn: async (maDoAn: string) => await http.post(`/students/${MSV}/thesis/${maDoAn}/join`),
    onSuccess: () => {
      toast.success('Đã đăng ký đồ án thành công!');
      qc.invalidateQueries({ queryKey: ['my-thesis-links', MSV] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Lỗi đăng ký đồ án')
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Đồ án tốt nghiệp</h1>
        <p className="text-slate-500">Đồ án được phân công</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allThesis.map((da: any) => {
          const isJoined = myThesisIds.has(String(da.maDoAn));
          const diem = Number(da.diem ?? 0);
          return (
            <Card key={String(da.maDoAn)} className={isJoined ? 'border-indigo-200 bg-indigo-50/10' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="size-5 text-indigo-500" />
                    {String(da.tenDoAn)}
                  </span>
                  {isJoined && <CheckCircle2 className="size-5 text-emerald-500" />}
                </CardTitle>
                <CardDescription>Mã: <code>{String(da.maDoAn)}</code> • Bậc: {String(da.bacDoAn)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-slate-400" />
                  <span>Bắt đầu: <strong>{formatDate(da.ngayBatDau)}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-slate-400" />
                  <span>Bảo vệ: <strong>{formatDate(da.ngayBaoVe)}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="size-4 text-amber-500" />
                  <span>Trạng thái: <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs">{String(da.trangThai)}</span></span>
                </div>
                {isJoined && diem > 0 && (
                  <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                    <p className="text-xs opacity-80">Điểm đạt được</p>
                    <p className="text-3xl font-display font-bold">{diem.toFixed(1)}</p>
                  </div>
                )}
                
                {!isJoined && (
                  <Button 
                    className="w-full mt-2" 
                    variant="outline"
                    onClick={() => joinMut.mutate(da.maDoAn)}
                    disabled={joinMut.isPending}
                  >
                    Đăng ký tham gia
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
