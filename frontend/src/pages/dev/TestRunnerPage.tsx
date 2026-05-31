import { useState } from 'react';
import { Play, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { repositories } from '@/lib/api';
import { ALL_TABLES } from '@qldh/shared';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'running' | 'pass' | 'fail';

interface TestCase {
  id: string;
  suite: string;
  name: string;
  fn: () => Promise<void>;
}

interface TestResult {
  status: Status;
  error?: string;
  durationMs?: number;
}

const TESTS: TestCase[] = [
  {
    id: 'auth-admin-ok',
    suite: 'Luan REST Auth',
    name: 'login admin ADMIN01/admin123',
    fn: async () => {
      const r = await repositories.auth.login({ username: 'ADMIN01', password: 'admin123', role: 'admin' });
      if (r.user.role !== 'admin') throw new Error('role khong phai admin');
      if (!r.token) throw new Error('missing token');
      window.localStorage.setItem('qldh:token', r.token);
    },
  },
  {
    id: 'auth-student-ok',
    suite: 'Luan REST Auth',
    name: 'login student SV001/student123',
    fn: async () => {
      const r = await repositories.auth.login({ username: 'SV001', password: 'student123', role: 'student' });
      if (r.user.role !== 'student') throw new Error('role khong phai student');
    },
  },
  {
    id: 'auth-teacher-ok',
    suite: 'Luan REST Auth',
    name: 'login teacher CB001/teacher123',
    fn: async () => {
      const r = await repositories.auth.login({ username: 'CB001', password: 'teacher123', role: 'teacher' });
      if (r.user.role !== 'teacher') throw new Error('role khong phai teacher');
    },
  },
  {
    id: 'generic-sinhvien',
    suite: 'Luan REST Admin Tables',
    name: 'GET /api/admin/tables/sinhVien',
    fn: async () => {
      const admin = await repositories.auth.login({ username: 'ADMIN01', password: 'admin123', role: 'admin' });
      window.localStorage.setItem('qldh:token', admin.token);
      const page = await repositories.generic.list('sinhVien', { page: 1, pageSize: 1 });
      if (!('items' in page) || !('total' in page)) throw new Error('sai page shape');
    },
  },
  {
    id: 'generic-all-tables',
    suite: 'Luan REST Admin Tables',
    name: 'list tat ca 25 bang',
    fn: async () => {
      const admin = await repositories.auth.login({ username: 'ADMIN01', password: 'admin123', role: 'admin' });
      window.localStorage.setItem('qldh:token', admin.token);
      for (const t of ALL_TABLES) {
        await repositories.generic.list(t, { page: 1, pageSize: 1 });
      }
    },
  },
  {
    id: 'student-classes',
    suite: 'Luan REST Student',
    name: 'GET /api/students/SV001/classes',
    fn: async () => {
      const student = await repositories.auth.login({ username: 'SV001', password: 'student123', role: 'student' });
      window.localStorage.setItem('qldh:token', student.token);
      const registrations = await repositories.class.listRegistrations('SV001');
      if (!Array.isArray(registrations)) throw new Error('registrations khong phai array');
    },
  },
];

export function TestRunnerPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [running, setRunning] = useState(false);

  const runAll = async () => {
    setRunning(true);
    const initial: Record<string, TestResult> = {};
    TESTS.forEach((t) => (initial[t.id] = { status: 'idle' }));
    setResults(initial);

    for (const t of TESTS) {
      setResults((p) => ({ ...p, [t.id]: { status: 'running' } }));
      const t0 = performance.now();
      try {
        await t.fn();
        setResults((p) => ({ ...p, [t.id]: { status: 'pass', durationMs: Math.round(performance.now() - t0) } }));
      } catch (e) {
        setResults((p) => ({
          ...p,
          [t.id]: {
            status: 'fail',
            error: e instanceof Error ? e.message : String(e),
            durationMs: Math.round(performance.now() - t0),
          },
        }));
      }
    }
    setRunning(false);
  };

  const passed = Object.values(results).filter((r) => r.status === 'pass').length;
  const failed = Object.values(results).filter((r) => r.status === 'fail').length;
  const total = TESTS.length;
  const suites = Array.from(new Set(TESTS.map((t) => t.suite)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Luan Backend Test Runner</h1>
          <p className="text-slate-500">Smoke tests goi truc tiep REST backend Luan.</p>
        </div>
        <Button onClick={runAll} disabled={running} size="lg">
          <Play className={cn('size-5', running && 'animate-pulse')} />
          {running ? 'Running...' : 'Run REST Tests'}
        </Button>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-2xl font-display font-bold">{total}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-xs text-emerald-600">Passed</p>
            <p className="text-2xl font-display font-bold text-emerald-600">{passed}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-xs text-rose-600">Failed</p>
            <p className="text-2xl font-display font-bold text-rose-600">{failed}</p>
          </CardContent></Card>
        </div>
      )}

      {suites.map((suite) => (
        <Card key={suite}>
          <CardHeader>
            <CardTitle className="font-mono text-base">{suite}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {TESTS.filter((t) => t.suite === suite).map((t) => {
              const r = results[t.id] ?? { status: 'idle' as Status };
              return (
                <div key={t.id} className={cn(
                  'p-3 rounded-lg border flex items-start gap-3 transition',
                  r.status === 'pass' && 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10',
                  r.status === 'fail' && 'border-rose-200 bg-rose-50 dark:bg-rose-900/10',
                  r.status === 'running' && 'border-indigo-200 bg-indigo-50 animate-pulse',
                  r.status === 'idle' && 'border-slate-200 dark:border-slate-700',
                )}>
                  {r.status === 'pass' && <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />}
                  {r.status === 'fail' && <XCircle className="size-5 text-rose-600 shrink-0" />}
                  {r.status === 'running' && <Circle className="size-5 text-indigo-600 shrink-0 animate-spin" />}
                  {r.status === 'idle' && <Circle className="size-5 text-slate-300 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{t.name}</p>
                    {r.error && <p className="text-xs text-rose-600 mt-1 font-mono break-all">{r.error}</p>}
                  </div>
                  {r.durationMs !== undefined && (
                    <span className="text-xs text-slate-500">{r.durationMs}ms</span>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
