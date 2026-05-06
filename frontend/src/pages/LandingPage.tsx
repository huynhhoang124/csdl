import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpenCheck, Terminal, Sparkles, ShieldCheck } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 size-96 rounded-full bg-fuchsia-500 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 size-96 rounded-full bg-indigo-500 blur-3xl animate-pulse" />
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8 text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl w-full text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm">
            <Sparkles className="size-4" /> Hệ thống Quản lý Đào tạo Đại học
          </div>
          <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight drop-shadow-2xl">QLDH</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Hệ thống Quản lý Đào tạo hiện đại — quản lý sinh viên, giảng viên, môn học, lớp và điểm số.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 max-w-4xl mx-auto">
            <LoginCard to="/login/student" title="Sinh viên" desc="Xem điểm, đăng ký lớp, hoạt động" icon={<GraduationCap className="size-8" />} />
            <LoginCard to="/login/teacher" title="Giảng viên" desc="Quản lý lớp, nhập điểm" icon={<BookOpenCheck className="size-8" />} />
            <LoginCard to="/login/admin" title="Quản trị" desc="Phòng Đào tạo — quản lý toàn bộ" icon={<ShieldCheck className="size-8" />} highlight />
          </div>
          <p className="text-sm opacity-60">
            Tài khoản demo: <code>SV001 / student123</code> · <code>CB001 / teacher123</code> · <code>ADMIN01 / admin123</code>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function LoginCard({ to, title, desc, icon, highlight }: { to: string; title: string; desc: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Link
        to={to}
        className={`block rounded-2xl backdrop-blur-lg p-8 border transition-all shadow-xl ${
          highlight
            ? 'bg-white/20 hover:bg-white/30 border-white/40 ring-2 ring-white/20'
            : 'bg-white/10 hover:bg-white/20 border-white/20'
        }`}
      >
        <div className={`size-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
          highlight ? 'bg-white/30' : 'bg-white/20'
        }`}>{icon}</div>
        <h3 className="text-2xl font-display font-semibold mb-2">{title}</h3>
        <p className="text-sm opacity-80">{desc}</p>
      </Link>
    </motion.div>
  );
}
