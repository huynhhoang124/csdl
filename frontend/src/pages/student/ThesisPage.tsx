import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { repositories } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Calendar, Award } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function ThesisPage() {
  const MSV = useAuthStore((s) => s.user?.MSV) ?? '';

  const { data: allThesis = [] } = useQuery({
    queryKey: ['all-thesis'],
    queryFn: async () => (await repositories.generic.list('doAnTN', { pageSize: 100 })).items,
  });

  const { data: myLinks = [] } = useQuery({
    queryKey: ['my-thesis-links', MSV],
    queryFn: async () => (await repositories.generic.list('sinhVien_DoAnTN', { search: MSV, pageSize: 100 })).items,
    enabled: !!MSV,
  });

  const myThesisIds = new Set(myLinks.filter((l) => l.MSV === MSV).map((l) => String(l.maDoAn)));
  const myThesis = allThesis.filter((t) => myThesisIds.has(String(t.maDoAn)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Đồ án tốt nghiệp</h1>
        <p className="text-slate-500">Đồ án được phân công</p>
      </div>

      {myThesis.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-slate-500">
            <FileText className="size-12 mx-auto mb-3 opacity-30" />
            <p>Bạn chưa được phân công đồ án</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myThesis.map((da) => {
            const diem = Number(da.diem ?? 0);
            return (
              <Card key={String(da.maDoAn)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5 text-indigo-500" />
                    {String(da.tenDoAn)}
                  </CardTitle>
                  <CardDescription>Mã: <code>{String(da.maDoAn)}</code> • Bậc: {String(da.bacDoAn)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-slate-400" />
                    <span>Bắt đầu: <strong>{formatDate(da.ngayBatDau as string)}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-slate-400" />
                    <span>Bảo vệ: <strong>{formatDate(da.ngayBaoVe as string)}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="size-4 text-amber-500" />
                    <span>Trạng thái: <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs">{String(da.trangThai)}</span></span>
                  </div>
                  {diem > 0 && (
                    <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                      <p className="text-xs opacity-80">Điểm đạt được</p>
                      <p className="text-3xl font-display font-bold">{diem.toFixed(1)}</p>
                    </div>
                  )}
                  {da.dinhKem != null && (
                    <p className="text-xs text-slate-500">Tài liệu: <code>{String(da.dinhKem)}</code></p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
