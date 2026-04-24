import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { repositories } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Users, BookOpen, ChevronRight, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

function diemToChu(d: number): string {
  if (d >= 9.5) return 'A+'; if (d >= 8.5) return 'A';
  if (d >= 8.0) return 'B+'; if (d >= 7.0) return 'B';
  if (d >= 6.5) return 'C+'; if (d >= 5.5) return 'C';
  if (d >= 5.0) return 'D+'; if (d >= 4.0) return 'D';
  return 'F';
}

export function TeacherClassesPage() {
  const MCB = useAuthStore((s) => s.user?.MCB) ?? '';
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const { data: classes = [] } = useQuery({
    queryKey: ['teacher-classes', MCB],
    queryFn: () => repositories.teacher.getTeachingClasses(MCB),
    enabled: !!MCB,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Lớp phụ trách</h1>
        <p className="text-slate-500">Chọn lớp để nhập/sửa điểm sinh viên</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((c) => (
          <Card key={c.maLop} className="hover:shadow-lg transition cursor-pointer" onClick={() => setSelectedClass(c.maLop)}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="font-mono text-base">{c.maLop}</span>
                <ChevronRight className="size-5 text-slate-400" />
              </CardTitle>
              <CardDescription>Môn: <code>{c.maMon}</code> • Kỳ {c.kyDaoTao}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="size-4 text-slate-400" />
                <span><strong>{c.soLuongSinhVien}</strong>/{c.soLuongSinhVienMax} SV</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="size-4 text-slate-400" />
                <span className={cn(
                  'px-2 py-0.5 rounded text-xs',
                  c.trangThai === 'Dang mo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                )}>{c.trangThai}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <GradingDialog
        maLop={selectedClass}
        onClose={() => setSelectedClass(null)}
        classes={classes}
      />
    </div>
  );
}

function GradingDialog({
  maLop, onClose, classes,
}: {
  maLop: string | null;
  onClose: () => void;
  classes: Array<{ maLop: string; maMon: string }>;
}) {
  const qc = useQueryClient();
  const clazz = classes.find((c) => c.maLop === maLop);
  const maMon = clazz?.maMon;

  const { data: registrations = [] } = useQuery({
    queryKey: ['class-regs', maLop],
    queryFn: async () =>
      (await repositories.generic.list('sinhVien_LopTinChi', { search: maLop ?? '', pageSize: 200 })).items,
    enabled: !!maLop,
  });

  const studentMSVs = registrations.filter((r) => r.maLop === maLop).map((r) => String(r.MSV));

  const { data: existingGrades = [] } = useQuery({
    queryKey: ['class-grades', maLop, maMon],
    queryFn: async () => {
      if (!maMon) return [];
      const all = (await repositories.generic.list('bangDiem', { pageSize: 10000 })).items;
      return all.filter((g) => g.maMon === maMon && studentMSVs.includes(String(g.MSV)));
    },
    enabled: !!maMon && studentMSVs.length > 0,
  });

  const [drafts, setDrafts] = useState<Record<string, number | ''>>({});

  const currentDraft = (MSV: string): number | '' => {
    if (MSV in drafts) return drafts[MSV] ?? '';
    const existing = existingGrades.find((g) => g.MSV === MSV);
    return existing?.diemSo != null ? Number(existing.diemSo) : '';
  };

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!maMon) return;
      const ops = Object.entries(drafts).map(async ([MSV, diem]) => {
        if (diem === '' || diem == null) return;
        const d = Number(diem);
        return repositories.grade.upsert({
          maMon, MSV, diemSo: d, diemChu: diemToChu(d) as never,
        });
      });
      await Promise.all(ops);
    },
    onSuccess: () => {
      toast.success(`Đã lưu ${Object.keys(drafts).length} điểm`);
      setDrafts({});
      qc.invalidateQueries({ queryKey: ['class-grades', maLop, maMon] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Lỗi lưu điểm'),
  });

  return (
    <Dialog open={!!maLop} onClose={onClose} title={`Nhập điểm - ${maLop}`} size="xl">
      <div className="space-y-3">
        <p className="text-sm text-slate-500">
          Môn: <code>{maMon}</code> • {studentMSVs.length} SV đăng ký
        </p>
        {studentMSVs.length === 0 ? (
          <p className="text-slate-500">Chưa có sinh viên đăng ký</p>
        ) : (
          <>
            <div className="max-h-[50vh] overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="py-2 px-3 text-left">MSV</th>
                    <th className="py-2 px-3 text-right w-32">Điểm số (0-10)</th>
                    <th className="py-2 px-3 text-center w-20">Điểm chữ</th>
                  </tr>
                </thead>
                <tbody>
                  {studentMSVs.map((MSV) => {
                    const v = currentDraft(MSV);
                    const num = v === '' ? 0 : Number(v);
                    return (
                      <tr key={MSV} className="border-b border-slate-100 dark:border-slate-800/50">
                        <td className="py-1.5 px-3 font-mono">{MSV}</td>
                        <td className="py-1 px-3">
                          <Input
                            type="number"
                            step="0.1"
                            min={0}
                            max={10}
                            value={v}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDrafts((p) => ({ ...p, [MSV]: val === '' ? '' : Number(val) }));
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="py-1.5 px-3 text-center">
                          {v !== '' && (
                            <span className={cn(
                              'inline-block px-2 py-0.5 rounded text-xs font-semibold',
                              num >= 8 ? 'bg-emerald-100 text-emerald-700' :
                              num >= 6.5 ? 'bg-blue-100 text-blue-700' :
                              num >= 5 ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                            )}>{diemToChu(num)}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {Object.keys(drafts).length > 0 ? `${Object.keys(drafts).length} thay đổi chưa lưu` : 'Không có thay đổi'}
              </span>
              <Button onClick={() => saveMut.mutate()} disabled={!Object.keys(drafts).length || saveMut.isPending}>
                <Save className="size-4" /> Lưu tất cả
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
