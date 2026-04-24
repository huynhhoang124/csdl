import { useState } from 'react';
import { Play, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MockAuthRepository, MockStudentRepository, MockCourseRepository, MockGenericRepository,
} from '@/lib/api/adapters/mock';
import { SinhVienSchema, ALL_TABLES } from '@qldh/shared';
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
    id: 'auth-dev-ok',
    suite: 'IAuthRepository',
    name: 'login dev thành công',
    fn: async () => {
      const repo = new MockAuthRepository();
      const r = await repo.login({ username: 'dev@qldh.local', password: 'dev123', role: 'dev' });
      if (r.user.role !== 'dev') throw new Error('role không phải dev');
      if (!r.token.startsWith('mock.')) throw new Error('token format sai');
    },
  },
  {
    id: 'auth-dev-wrong',
    suite: 'IAuthRepository',
    name: 'login dev sai password → error',
    fn: async () => {
      const repo = new MockAuthRepository();
      try {
        await repo.login({ username: 'dev@qldh.local', password: 'wrong', role: 'dev' });
        throw new Error('không throw');
      } catch (e) {
        if (!(e instanceof Error) || !e.message.includes('Sai')) throw new Error('sai thông báo');
      }
    },
  },
  {
    id: 'student-list',
    suite: 'IStudentRepository',
    name: 'list trả về Page shape',
    fn: async () => {
      const repo = new MockStudentRepository();
      const p = await repo.list({ page: 1, pageSize: 10 });
      if (!('items' in p) || !('total' in p)) throw new Error('sai shape');
      if (p.items.length > 10) throw new Error('vượt pageSize');
    },
  },
  {
    id: 'student-zod',
    suite: 'IStudentRepository',
    name: 'findById → SinhVien đúng Zod schema',
    fn: async () => {
      const repo = new MockStudentRepository();
      const first = (await repo.list({ pageSize: 1 })).items[0]!;
      const sv = await repo.findById(first.MSV);
      const r = SinhVienSchema.safeParse(sv);
      if (!r.success) throw new Error(JSON.stringify(r.error.issues));
    },
  },
  {
    id: 'student-grades',
    suite: 'IStudentRepository',
    name: 'getGrades trả về mảng',
    fn: async () => {
      const repo = new MockStudentRepository();
      const g = await repo.getGrades('SV0001');
      if (!Array.isArray(g)) throw new Error('không phải mảng');
    },
  },
  {
    id: 'generic-all-tables',
    suite: 'IGenericRepository',
    name: 'list tất cả 26 bảng không throw',
    fn: async () => {
      const repo = new MockGenericRepository();
      for (const t of ALL_TABLES) {
        await repo.list(t, { pageSize: 1 });
      }
    },
  },
  {
    id: 'generic-reset',
    suite: 'IGenericRepository',
    name: 'resetAndReseed hoàn thành',
    fn: async () => {
      const repo = new MockGenericRepository();
      const r = await repo.resetAndReseed();
      if (!r.ok) throw new Error('not ok');
    },
  },
  {
    id: 'course-canregister',
    suite: 'ICourseRepository',
    name: 'canRegister trả về shape đúng',
    fn: async () => {
      const repo = new MockCourseRepository();
      const r = await repo.canRegister('SV0001', 'M', 'CT', 'CN');
      if (typeof r.ok !== 'boolean') throw new Error('missing .ok');
      if (!Array.isArray(r.missing)) throw new Error('missing .missing');
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
          <h1 className="text-3xl font-display font-bold">Test Runner</h1>
          <p className="text-slate-500">Contract tests — đảm bảo mọi adapter tuân thủ interface</p>
        </div>
        <Button onClick={runAll} disabled={running} size="lg">
          <Play className={cn('size-5', running && 'animate-pulse')} />
          {running ? 'Running...' : 'Run All Tests'}
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
