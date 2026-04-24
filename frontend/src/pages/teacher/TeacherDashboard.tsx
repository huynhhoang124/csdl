import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, FlaskConical } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { repositories } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TeacherDashboard() {
  const user = useAuthStore((s) => s.user);
  const MCB = user?.MCB ?? '';

  const { data: classes = [] } = useQuery({
    queryKey: ['teacher-classes', MCB],
    queryFn: () => repositories.teacher.getTeachingClasses(MCB),
    enabled: !!MCB,
  });

  const totalStudents = classes.reduce((s, c) => s + (c.soLuongSinhVien ?? 0), 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold">Xin chào, Thầy/Cô {user?.displayName}!</h1>
        <p className="text-slate-500">Bảng tổng hợp lớp phụ trách</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<BookOpen />} label="Lớp tín chỉ" value={classes.length} gradient="from-emerald-500 to-teal-500" />
        <StatCard icon={<Users />} label="Tổng sinh viên" value={totalStudents} gradient="from-cyan-500 to-blue-500" />
        <StatCard icon={<FileText />} label="Đồ án hướng dẫn" value={0} gradient="from-indigo-500 to-purple-500" />
        <StatCard icon={<FlaskConical />} label="Đề tài NCKH" value={0} gradient="from-amber-500 to-orange-500" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lớp tín chỉ đang phụ trách</CardTitle>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <p className="text-slate-500">Chưa có lớp nào</p>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {classes.map((c) => (
                <div key={c.maLop} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.maLop}</p>
                    <p className="text-sm text-slate-500">Môn: {c.maMon} • Kỳ: {c.kyDaoTao}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      <span className="font-semibold">{c.soLuongSinhVien}</span>
                      <span className="text-slate-400">/{c.soLuongSinhVienMax}</span> SV
                    </p>
                    <span className="text-xs text-emerald-600">{c.trangThai}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, gradient }: { icon: React.ReactNode; label: string; value: number; gradient: string }) {
  return (
    <Card className="overflow-hidden relative">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      <CardContent className="p-6">
        <div className={`size-12 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-lg mb-3`}>
          {icon}
        </div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-3xl font-display font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}
