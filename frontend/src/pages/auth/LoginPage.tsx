import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LoginRequestSchema, type LoginRequest, type Role } from '@qldh/shared';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { GraduationCap, BookOpenCheck, Terminal, ArrowLeft } from 'lucide-react';

interface Props { role: Role }

const ROLE_META: Record<Role, { title: string; subtitle: string; icon: React.ReactNode; hint: string; gradient: string; usernameLabel: string }> = {
  student: {
    title: 'Dang nhap Sinh vien',
    subtitle: 'Truy cap bang diem, dang ky lop, hoat dong',
    icon: <GraduationCap className="size-10" />,
    hint: 'Mac dinh: SV001 / student123',
    gradient: 'from-indigo-600 via-purple-600 to-fuchsia-600',
    usernameLabel: 'Ma sinh vien (MSV)',
  },
  teacher: {
    title: 'Dang nhap Giang vien',
    subtitle: 'Quan ly lop tin chi, nhap diem, huong dan',
    icon: <BookOpenCheck className="size-10" />,
    hint: 'Mac dinh: CB001 / teacher123',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    usernameLabel: 'Ma can bo (MCB)',
  },
  admin: {
    title: 'Admin Console',
    subtitle: 'Toan quyen quan tri he thong',
    icon: <Terminal className="size-10" />,
    hint: 'ADMIN01 / admin123',
    gradient: 'from-slate-900 via-slate-800 to-zinc-900',
    usernameLabel: 'Ma admin',
  },
};

export function LoginPage({ role }: Props) {
  const meta = ROLE_META[role];
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { role, username: '', password: '' },
  });

  const onSubmit = async (data: LoginRequest) => {
    setSubmitting(true);
    try {
      const user = await login(data);
      toast.success(`Xin chao ${user.displayName}!`);
      navigate(`/${user.role}`, { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Dang nhap that bai');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${meta.gradient} flex items-center justify-center p-4`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm">
          <ArrowLeft className="size-4" /> Quay lai trang chu
        </Link>
        <Card className="backdrop-blur bg-white/95 dark:bg-slate-900/95 shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`size-16 rounded-2xl bg-gradient-to-br ${meta.gradient} text-white flex items-center justify-center shadow-lg`}>
                {meta.icon}
              </div>
              <div>
                <CardTitle>{meta.title}</CardTitle>
                <CardDescription>{meta.subtitle}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{meta.usernameLabel}</Label>
                <Input id="username" autoComplete="username" {...register('username')} />
                {errors.username && <p className="text-xs text-rose-600">{errors.username.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mat khau</Label>
                <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
                {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
              </div>
              <p className="text-xs text-slate-500 italic">{meta.hint}</p>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" size="lg" disabled={submitting || loading}>
                {submitting || loading ? 'Dang dang nhap...' : 'Dang nhap'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
