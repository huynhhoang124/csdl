import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpenCheck, Terminal, Sparkles } from 'lucide-react';

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
            <Sparkles className="size-4" /> Pluggable Backend Architecture
          </div>
          <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight drop-shadow-2xl">QLDH</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            He thong Quan ly Dao tao hien dai, ket noi backend REST cua Luan voi cac portal sinh vien, giang vien va admin.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
            <LoginCard to="/login/student" title="Sinh vien" desc="Xem diem, dang ky lop, hoat dong" icon={<GraduationCap className="size-8" />} />
            <LoginCard to="/login/teacher" title="Giang vien" desc="Quan ly lop, nhap diem" icon={<BookOpenCheck className="size-8" />} />
            <LoginCard to="/login/admin" title="Admin" desc="Toan quyen quan tri" icon={<Terminal className="size-8" />} />
          </div>
          <p className="text-sm opacity-60">
            Tai khoan demo: <code>SV001 / student123</code> · <code>CB001 / teacher123</code> · <code>ADMIN01 / admin123</code>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function LoginCard({ to, title, desc, icon }: { to: string; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Link to={to} className="block rounded-2xl bg-white/10 backdrop-blur-lg hover:bg-white/20 p-8 border border-white/20 transition-all shadow-xl">
        <div className="size-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">{icon}</div>
        <h3 className="text-2xl font-display font-semibold mb-2">{title}</h3>
        <p className="text-sm opacity-80">{desc}</p>
      </Link>
    </motion.div>
  );
}
