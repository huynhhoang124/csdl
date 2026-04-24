import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Database, RefreshCw, Terminal, Users } from 'lucide-react';
import { repositories, getBackendMode } from '@/lib/api';
import { ALL_TABLES } from '@qldh/shared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DevDashboard() {
  const qc = useQueryClient();
  const mode = getBackendMode();

  const counts = useQuery({
    queryKey: ['dev-table-counts', mode],
    queryFn: async () => {
      const entries = await Promise.all(
        ALL_TABLES.map(async (t) => {
          try {
            const page = await repositories.generic.list(t, { page: 1, pageSize: 1 });
            return [t, page.total] as const;
          } catch {
            return [t, -1] as const;
          }
        })
      );
      return Object.fromEntries(entries);
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => repositories.generic.resetAndReseed(),
    onSuccess: (r) => {
      toast.success(`Reset xong trong ${r.durationMs}ms`);
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Reset thất bại'),
  });

  const totalRecords = Object.values(counts.data ?? {}).reduce((s, v) => s + Math.max(0, v as number), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <Terminal className="size-8" /> Developer Console
          </h1>
          <p className="text-slate-500">Toàn quyền kiểm thử • Backend hiện tại: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{mode}</code></p>
        </div>
        <Button onClick={() => resetMutation.mutate()} disabled={resetMutation.isPending}>
          <RefreshCw className={resetMutation.isPending ? 'animate-spin' : ''} />
          Reset & Reseed
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <Database className="size-8 text-indigo-500 mb-3" />
            <p className="text-sm text-slate-500">Tổng số bảng</p>
            <p className="text-3xl font-display font-bold">{ALL_TABLES.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Users className="size-8 text-purple-500 mb-3" />
            <p className="text-sm text-slate-500">Tổng bản ghi</p>
            <p className="text-3xl font-display font-bold">{totalRecords.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Terminal className="size-8 text-emerald-500 mb-3" />
            <p className="text-sm text-slate-500">Backend mode</p>
            <p className="text-3xl font-display font-bold">{mode}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thống kê theo bảng</CardTitle>
          <CardDescription>Số bản ghi hiện có trong mỗi bảng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ALL_TABLES.map((t) => {
              const n = counts.data?.[t] ?? 0;
              return (
                <div key={t} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-indigo-500 transition">
                  <span className="font-mono text-xs truncate">{t}</span>
                  <span className="text-sm font-semibold">{n < 0 ? '—' : n}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
