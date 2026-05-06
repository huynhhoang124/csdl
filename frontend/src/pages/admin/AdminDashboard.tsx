import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import {
  GraduationCap, Users, BookOpen, School, Building2, Layers,
} from 'lucide-react';
import { repositories } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f59e0b', '#10b981', '#ef4444'];
const STATUS_COLORS: Record<string, string> = {
  'Dang hoc': '#10b981',
  'Bao luu': '#f59e0b',
  'Da tot nghiep': '#6366f1',
  'Thoi hoc': '#ef4444',
};

export function AdminDashboard() {
  const user = useAuthStore((s) => s.user);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Use generic repository to build stats from mock data
      const [svPage, cbPage, monPage, ltcPage, khoaPage, cnPage] = await Promise.all([
        repositories.generic.list('sinhVien', { pageSize: 1 }),
        repositories.generic.list('canBo', { pageSize: 1 }),
        repositories.generic.list('mon', { pageSize: 1 }),
        repositories.generic.list('lopTinChi', { pageSize: 1 }),
        repositories.generic.list('Khoa', { pageSize: 1 }),
        repositories.generic.list('chuyenNganh', { pageSize: 1 }),
      ]);
      return {
        totalStudents: svPage.total,
        totalTeachers: cbPage.total,
        totalCourses: monPage.total,
        totalClasses: ltcPage.total,
        totalDepartments: khoaPage.total,
        totalPrograms: cnPage.total,
      };
    },
  });

  const { data: students = [] } = useQuery({
    queryKey: ['admin-students-all'],
    queryFn: async () => {
      const page = await repositories.student.list({ pageSize: 200 });
      return page.items;
    },
  });

  // Calculate GPA distribution
  const gpaDistribution = [
    { name: 'Xuất sắc (≥3.6)', value: students.filter((s) => (s.GPA ?? 0) >= 3.6).length },
    { name: 'Giỏi (3.2-3.6)', value: students.filter((s) => (s.GPA ?? 0) >= 3.2 && (s.GPA ?? 0) < 3.6).length },
    { name: 'Khá (2.5-3.2)', value: students.filter((s) => (s.GPA ?? 0) >= 2.5 && (s.GPA ?? 0) < 3.2).length },
    { name: 'TB (2.0-2.5)', value: students.filter((s) => (s.GPA ?? 0) >= 2.0 && (s.GPA ?? 0) < 2.5).length },
    { name: 'Yếu (<2.0)', value: students.filter((s) => (s.GPA ?? 0) < 2.0).length },
  ].filter((d) => d.value > 0);

  // Status distribution
  const statusMap = new Map<string, number>();
  students.forEach((s) => {
    const st = s.trangThai ?? 'Khong ro';
    statusMap.set(st, (statusMap.get(st) ?? 0) + 1);
  });
  const statusDistribution = [...statusMap.entries()].map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold">Bảng điều khiển Quản trị</h1>
        <p className="text-slate-500">Xin chào, {user?.displayName} — Tổng quan hệ thống đào tạo</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={<GraduationCap className="size-6" />} label="Sinh viên" value={stats?.totalStudents ?? 0} gradient="from-indigo-500 to-purple-500" />
        <StatCard icon={<Users className="size-6" />} label="Cán bộ / GV" value={stats?.totalTeachers ?? 0} gradient="from-emerald-500 to-teal-500" />
        <StatCard icon={<BookOpen className="size-6" />} label="Môn học" value={stats?.totalCourses ?? 0} gradient="from-amber-500 to-orange-500" />
        <StatCard icon={<School className="size-6" />} label="Lớp tín chỉ" value={stats?.totalClasses ?? 0} gradient="from-cyan-500 to-blue-500" />
        <StatCard icon={<Building2 className="size-6" />} label="Khoa" value={stats?.totalDepartments ?? 0} gradient="from-fuchsia-500 to-pink-500" />
        <StatCard icon={<Layers className="size-6" />} label="Chuyên ngành" value={stats?.totalPrograms ?? 0} gradient="from-rose-500 to-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phân bố GPA sinh viên</CardTitle>
            <CardDescription>Tổng cộng {students.length} sinh viên</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={gpaDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {gpaDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trạng thái sinh viên</CardTitle>
            <CardDescription>Phân bố theo tình trạng học tập</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer>
              <BarChart data={statusDistribution} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] ?? COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, gradient }: {
  icon: React.ReactNode; label: string; value: number; gradient: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="overflow-hidden relative">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
        <CardContent className="p-5">
          <div className={`size-10 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-lg mb-3`}>
            {icon}
          </div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-2xl font-display font-bold mt-1">{value.toLocaleString()}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
