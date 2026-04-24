import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import { BookOpen, TrendingUp, Award, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { repositories } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatGPA } from '@/lib/utils';

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f59e0b', '#10b981', '#ef4444'];

export function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const MSV = user?.MSV ?? '';

  const { data: grades = [] } = useQuery({
    queryKey: ['grades', MSV],
    queryFn: () => repositories.student.getGrades(MSV),
    enabled: !!MSV,
  });

  const { data: student } = useQuery({
    queryKey: ['student', MSV],
    queryFn: () => repositories.student.findById(MSV),
    enabled: !!MSV,
  });

  const { data: registrations = [] } = useQuery({
    queryKey: ['registrations', MSV],
    queryFn: () => repositories.class.listRegistrations(MSV),
    enabled: !!MSV,
  });

  const avgScore = grades.length
    ? grades.reduce((s, g) => s + (g.diemSo ?? 0), 0) / grades.length
    : 0;

  const gradeDistribution = ['A+','A','B+','B','C+','C','D+','D','F'].map((chu) => ({
    name: chu,
    value: grades.filter((g) => g.diemChu === chu).length,
  })).filter((d) => d.value > 0);

  const trendData = grades.slice(-10).map((g, i) => ({
    name: `Môn ${i + 1}`,
    diem: g.diemSo ?? 0,
  }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold">Xin chào, {user?.displayName}!</h1>
        <p className="text-slate-500">Tổng quan hoạt động học tập của bạn</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<GraduationCap className="size-6" />}
          label="GPA hiện tại"
          value={formatGPA(student?.GPA)}
          gradient="from-indigo-500 to-purple-500"
        />
        <StatCard
          icon={<TrendingUp className="size-6" />}
          label="CPA tích lũy"
          value={formatGPA(student?.CPA)}
          gradient="from-purple-500 to-fuchsia-500"
        />
        <StatCard
          icon={<BookOpen className="size-6" />}
          label="Số môn đã học"
          value={String(grades.length)}
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard
          icon={<Award className="size-6" />}
          label="Lớp đang đăng ký"
          value={String(registrations.length)}
          gradient="from-amber-500 to-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng điểm</CardTitle>
            <CardDescription>10 môn gần nhất — TB: {avgScore.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="diem" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố điểm chữ</CardTitle>
            <CardDescription>Thống kê {grades.length} môn đã học</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={gradeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {gradeDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, gradient }: {
  icon: React.ReactNode; label: string; value: string; gradient: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="overflow-hidden relative">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className={`size-12 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-lg`}>
              {icon}
            </div>
          </div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-3xl font-display font-bold mt-1">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
