import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { http } from '@/lib/api/adapters/rest/httpClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function ResearchPage() {
  const MSV = useAuthStore((s) => s.user?.MSV) ?? '';
  const qc = useQueryClient();

  const { data: allData } = useQuery({
    queryKey: ['student-all-research'],
    queryFn: async () => (await http.get('/students/research')).data,
  });
  const allResearch = allData?.items ?? [];

  const { data: myLinksData } = useQuery({
    queryKey: ['my-research-links', MSV],
    queryFn: async () => (await http.get(`/students/${MSV}/research`)).data,
    enabled: !!MSV,
  });
  const myLinks = myLinksData?.items ?? [];

  const myResearchIds = new Set(myLinks.filter((l: any) => l.MSV === MSV).map((l: any) => String(l.maDeTai)));

  const joinMut = useMutation({
    mutationFn: async (maDeTai: string) => await http.post(`/students/${MSV}/research/${maDeTai}/join`),
    onSuccess: () => {
      toast.success('Đã đăng ký tham gia đề tài thành công!');
      qc.invalidateQueries({ queryKey: ['my-research-links', MSV] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Lỗi đăng ký nghiên cứu')
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Nghiên cứu khoa học</h1>
        <p className="text-slate-500">
          Có <strong>{allResearch.length}</strong> đề tài • Bạn đang tham gia <strong>{myResearchIds.size}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allResearch.map((nc: any) => {
          const isJoined = myResearchIds.has(String(nc.maDeTai));
          return (
            <Card key={String(nc.maDeTai)} className={isJoined ? 'border-amber-200 bg-amber-50/10' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FlaskConical className="size-5 text-amber-500" />
                    {String(nc.tenDeTai)}
                  </span>
                  {isJoined && <CheckCircle2 className="size-5 text-emerald-500" />}
                </CardTitle>
                <CardDescription>Mã: <code>{String(nc.maDeTai)}</code></CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Cấp: <strong>{String(nc.capDeTai || 'Cơ sở')}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Kinh phí: {nc.kinhPhi ? Number(nc.kinhPhi).toLocaleString() + ' đ' : 'Chưa cấp'}</span>
                </div>
                <div className="text-sm text-slate-500 line-clamp-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {String(nc.moTa || 'Chưa có mô tả chi tiết')}
                </div>
                {!isJoined && (
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => joinMut.mutate(nc.maDeTai)}
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
