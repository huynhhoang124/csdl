import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { repositories } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function GradesPage() {
  const MSV = useAuthStore((s) => s.user?.MSV) ?? '';
  const { data: grades = [], isLoading } = useQuery({
    queryKey: ['grades', MSV],
    queryFn: () => repositories.student.getGrades(MSV),
    enabled: !!MSV,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Bảng điểm</h1>
      <Card>
        <CardHeader>
          <CardTitle>{grades.length} môn đã học</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-slate-500">Đang tải...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-800">
                  <tr className="text-left text-slate-500">
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Mã môn</th>
                    <th className="py-2 px-3 text-right">Điểm số</th>
                    <th className="py-2 px-3 text-center">Điểm chữ</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, i) => (
                    <tr key={`${g.maMon}-${i}`} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-slate-400">{i + 1}</td>
                      <td className="py-2 px-3 font-mono">{g.maMon}</td>
                      <td className="py-2 px-3 text-right font-semibold">{g.diemSo?.toFixed(1) ?? '—'}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          g.diemChu === 'A+' || g.diemChu === 'A' ? 'bg-emerald-100 text-emerald-700' :
                          g.diemChu?.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                          g.diemChu?.startsWith('C') ? 'bg-amber-100 text-amber-700' :
                          g.diemChu === 'F' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {g.diemChu ?? '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
