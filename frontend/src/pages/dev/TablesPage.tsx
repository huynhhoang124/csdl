import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Download } from 'lucide-react';
import { exportCsv } from '@/lib/csv';
import { repositories } from '@/lib/api';
import { ALL_TABLES, type TableName } from '@qldh/shared';
import { SCHEMA_REGISTRY } from '@/lib/schemaRegistry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ZodForm } from '@/components/forms/ZodForm';
import { cn } from '@/lib/utils';

type Row = Record<string, unknown>;

export function TablesPage() {
  const [table, setTable] = useState<TableName>('sinhVien');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const pageSize = 20;
  const qc = useQueryClient();
  const meta = SCHEMA_REGISTRY[table];

  const { data, isLoading } = useQuery({
    queryKey: ['dev-table', table, search, page],
    queryFn: () => repositories.generic.list(table, { page, pageSize, search }),
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const columns = items[0] ? Object.keys(items[0]) : Object.keys(meta.schema.shape);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['dev-table', table] });

  const createMut = useMutation({
    mutationFn: (data: Row) => repositories.generic.create(table, data),
    onSuccess: () => { toast.success('Đã tạo'); setCreateOpen(false); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Lỗi tạo'),
  });

  const updateMut = useMutation({
    mutationFn: ({ pk, data }: { pk: Row; data: Row }) => repositories.generic.update(table, pk, data),
    onSuccess: () => { toast.success('Đã cập nhật'); setEditRow(null); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Lỗi cập nhật'),
  });

  const deleteMut = useMutation({
    mutationFn: (pk: Row) => repositories.generic.delete(table, pk),
    onSuccess: () => { toast.success('Đã xóa'); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Lỗi xóa'),
  });

  const getPK = (row: Row): Row => {
    const pk: Row = {};
    meta.primaryKeys.forEach((k) => (pk[k] = row[k]));
    return pk;
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      <aside className="w-56 shrink-0">
        <Card className="h-full">
          <CardHeader><CardTitle className="text-sm">26 Bảng</CardTitle></CardHeader>
          <CardContent className="p-2 overflow-y-auto h-[calc(100%-4rem)]">
            {ALL_TABLES.map((t) => (
              <button
                key={t}
                onClick={() => { setTable(t); setPage(1); setSearch(''); }}
                className={cn(
                  'w-full text-left px-3 py-1.5 rounded text-xs font-mono transition',
                  t === table ? 'bg-brand-gradient text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >{t}</button>
            ))}
          </CardContent>
        </Card>
      </aside>

      <div className="flex-1 min-w-0">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-row items-center justify-between gap-4">
            <div>
              <CardTitle><code className="text-brand-600">{table}</code></CardTitle>
              <p className="text-xs text-slate-500">{total} bản ghi • PK: {meta.primaryKeys.join(', ')}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Input placeholder="Tìm kiếm..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-xs" />
              <Button variant="outline" onClick={async () => {
                const all = await repositories.generic.list(table, { pageSize: 10000 });
                exportCsv(`${table}.csv`, all.items);
              }}><Download className="size-4" /> CSV</Button>
              <Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /> Thêm</Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {isLoading ? (
              <p className="text-slate-500">Đang tải...</p>
            ) : items.length === 0 ? (
              <p className="text-slate-500">Không có dữ liệu</p>
            ) : (
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
                  <tr>
                    {columns.map((c) => (
                      <th key={c} className="py-2 px-3 text-left font-mono">{c}</th>
                    ))}
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/30 group">
                      {columns.map((c) => (
                        <td key={c} className="py-1.5 px-3 font-mono truncate max-w-[200px]" title={String(row[c] ?? '')}>
                          {row[c] == null ? <span className="text-slate-300">null</span> : String(row[c])}
                        </td>
                      ))}
                      <td className="py-1 px-3 text-right opacity-0 group-hover:opacity-100 transition">
                        <Button variant="ghost" size="icon" onClick={() => setEditRow(row)}><Pencil className="size-3.5" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => {
                          if (confirm('Xóa bản ghi này?')) deleteMut.mutate(getPK(row));
                        }}><Trash2 className="size-3.5 text-rose-500" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Trang {page}/{totalPages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹ Trước</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Sau ›</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title={`Tạo ${table}`} size="lg">
        <ZodForm
          schema={meta.schema}
          onSubmit={async (d) => { await createMut.mutateAsync(d as Row); }}
          submitLabel="Tạo mới"
        />
      </Dialog>

      <Dialog open={!!editRow} onClose={() => setEditRow(null)} title={`Sửa ${table}`} size="lg">
        {editRow && (
          <ZodForm
            schema={meta.schema}
            defaultValues={editRow}
            disabledFields={meta.primaryKeys}
            onSubmit={async (d) => { await updateMut.mutateAsync({ pk: getPK(editRow), data: d as Row }); }}
            submitLabel="Cập nhật"
          />
        )}
      </Dialog>
    </div>
  );
}
