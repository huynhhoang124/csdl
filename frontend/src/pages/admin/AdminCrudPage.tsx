import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, Download, Upload } from 'lucide-react';
import { repositories } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TableName } from '@qldh/shared';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';

interface Props {
  table: TableName;
  title: string;
  description: string;
  columns: {
    key: string;
    label: string;
    pk?: boolean;
    type?: 'text' | 'number' | 'select' | 'date';
    options?: string[];
    fk?: { table: TableName; valueKey: string; displayKey: string };
    required?: boolean;
    hiddenInList?: boolean;
    hiddenInForm?: boolean;
    min?: number;
    max?: number;
    step?: string;
    validate?: (val: any) => string | undefined;
  }[];
  importUpsert?: boolean;
}

export function AdminCrudPage({ table, title, description, columns, importUpsert }: Props) {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageSize = 15;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', table, page, search],
    queryFn: () => repositories.generic.list(table, { page, pageSize, search }),
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pkCols = columns.filter((c) => c.pk).map((c) => c.key);
  const getPk = (row: Record<string, unknown>) =>
    Object.fromEntries(pkCols.map((k) => [k, row[k]]));

  const handleError = (e: unknown) => {
    if (typeof e === 'object' && e !== null && 'response' in e) {
      const axiosErr = e as any;
      if (axiosErr.response?.data?.message) {
        toast.error(axiosErr.response.data.message);
        return;
      }
    }
    toast.error(e instanceof Error ? e.message : 'Thao tác thất bại');
  };

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => repositories.generic.create(table, data),
    onSuccess: () => { toast.success('Thêm thành công'); setEditRow(null); qc.invalidateQueries({ queryKey: ['admin', table] }); },
    onError: handleError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ pk, data }: { pk: Record<string, unknown>; data: Record<string, unknown> }) =>
      repositories.generic.update(table, pk, data),
    onSuccess: () => { toast.success('Cập nhật thành công'); setEditRow(null); qc.invalidateQueries({ queryKey: ['admin', table] }); },
    onError: handleError,
  });

  const deleteMutation = useMutation({
    mutationFn: (pk: Record<string, unknown>) => repositories.generic.delete(table, pk),
    onSuccess: () => { toast.success('Xóa thành công'); qc.invalidateQueries({ queryKey: ['admin', table] }); },
    onError: handleError,
  });

  const upsertMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => repositories.generic.upsert(table, data),
    onError: handleError,
  });

  const openCreate = () => {
    setIsNew(true);
    setEditRow(Object.fromEntries(columns.map((c) => [c.key, ''])));
  };

  const openEdit = (row: Record<string, unknown>) => {
    setIsNew(false);
    setEditRow({ ...row });
  };

  const handleSave = () => {
    if (!editRow) return;
    
    // Validation
    for (const col of columns) {
      if (col.validate) {
        const error = col.validate(editRow[col.key]);
        if (error) {
          toast.error(`${col.label}: ${error}`);
          return;
        }
      }
      if (col.required && !editRow[col.key]) {
        toast.error(`${col.label} là bắt buộc`);
        return;
      }
    }

    if (isNew) {
      createMutation.mutate(editRow);
    } else {
      updateMutation.mutate({ pk: getPk(editRow), data: editRow });
    }
  };

  const handleExport = async () => {
    try {
      // Fetch all data for export
      const fullData = await repositories.generic.list(table, { pageSize: 10000, search });
      const ws = XLSX.utils.json_to_sheet(fullData.items);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, table);
      XLSX.writeFile(wb, `${table}_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success('Xuất file thành công');
    } catch (e) {
      toast.error('Lỗi khi xuất file');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        if (!wsname) throw new Error('File Excel không có sheet nào');
        const ws = wb.Sheets[wsname as string];
        if (!ws) throw new Error('Không tìm thấy sheet');
        const data = XLSX.utils.sheet_to_json(ws) as Record<string, unknown>[];

        let successCount = 0;
        let failCount = 0;

        toast.info(`Bắt đầu import ${data.length} bản ghi...`);

        for (const row of data) {
          try {
            if (importUpsert) {
              await upsertMutation.mutateAsync(row);
            } else {
              await createMutation.mutateAsync(row);
            }
            successCount++;
          } catch (err) {
            failCount++;
            console.error('Import row failed:', row, err);
          }
        }

        toast.success(`Import hoàn tất! Thành công: ${successCount}, Thất bại: ${failCount}`);
        qc.invalidateQueries({ queryKey: ['admin', table] });
      } catch (err) {
        toast.error('Lỗi khi đọc file Excel');
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold">{title}</h1>
          <p className="text-slate-500">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="size-4 mr-2" /> Xuất Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="size-4 mr-2" /> Nhập Excel
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls" onChange={handleImport} />
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>{total.toLocaleString()} bản ghi</CardTitle>
              <CardDescription>Bảng: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{table}</code></CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-slate-400" />
                <Input
                  className="pl-8 w-60"
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <Button onClick={openCreate}>
                <Plus className="size-4 mr-1" /> Thêm mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-slate-500 py-8 text-center">Đang tải...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-200 dark:border-slate-800">
                    <tr className="text-left text-slate-500">
                      <th className="py-2 px-3 w-12">#</th>
                      {columns.filter(c => !c.hiddenInList).map((col) => (
                        <th key={col.key} className="py-2 px-3">
                          {col.label}
                          {col.pk && <span className="ml-1 text-xs text-indigo-500">PK</span>}
                        </th>
                      ))}
                      <th className="py-2 px-3 text-right w-24">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row, i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                        <td className="py-2 px-3 text-slate-400">{(page - 1) * pageSize + i + 1}</td>
                        {columns.filter(c => !c.hiddenInList).map((col) => (
                          <td key={col.key} className="py-2 px-3 max-w-[200px] truncate" title={String(row[col.key] ?? '')}>
                            {row[col.key] == null ? <span className="text-slate-300">—</span> : String(row[col.key])}
                          </td>
                        ))}
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(row)} title="Sửa">
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm('Bạn có chắc muốn xóa?')) {
                                  deleteMutation.mutate(getPk(row));
                                }
                              }}
                              title="Xóa"
                              className="text-rose-500 hover:text-rose-600"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={columns.length + 2} className="py-8 text-center text-slate-400">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-slate-500">
                  Trang {page}/{totalPages} — {total} bản ghi
                </p>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      {editRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setEditRow(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-display font-bold">{isNew ? 'Thêm mới' : 'Chỉnh sửa'}</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditRow(null)}>
                <X className="size-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              {columns.filter(c => !c.hiddenInForm).map((col) => (
                <div key={col.key} className="space-y-1">
                  <Label>
                    {col.label}
                    {col.pk && <span className="ml-1 text-xs text-indigo-500">(PK)</span>}
                    {col.required && <span className="ml-1 text-rose-500">*</span>}
                  </Label>
                  {col.fk ? (
                    <FkSelect
                      fk={col.fk}
                      label={col.label}
                      value={String(editRow[col.key] ?? '')}
                      onChange={(v) => setEditRow({ ...editRow, [col.key]: v })}
                      disabled={col.pk && !isNew}
                    />
                  ) : col.type === 'select' ? (
                    <select
                      value={String(editRow[col.key] ?? '')}
                      onChange={(e) => setEditRow({ ...editRow, [col.key]: e.target.value })}
                      disabled={col.pk && !isNew}
                      required={col.required}
                      className={cn(
                        'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
                        col.pk && !isNew && 'opacity-50'
                      )}
                    >
                      <option value="">-- Chọn {col.label} --</option>
                      {col.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                      min={col.min}
                      max={col.max}
                      step={col.step}
                      required={col.required}
                      value={String(editRow[col.key] ?? '')}
                      onChange={(e) => setEditRow({
                        ...editRow,
                        [col.key]: col.type === 'number' ? Number(e.target.value) : e.target.value
                      })}
                      disabled={col.pk && !isNew}
                      className={cn(col.pk && !isNew && 'opacity-50')}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 p-6 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" onClick={() => setEditRow(null)}>Hủy</Button>
              <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function FkSelect({ fk, value, onChange, disabled, label }: { fk: { table: TableName; valueKey: string; displayKey: string }, value: string, onChange: (v: string) => void, disabled?: boolean, label: string }) {
  const { data } = useQuery({
    queryKey: ['admin', fk.table, 'fk-list'],
    queryFn: () => repositories.generic.list(fk.table, { pageSize: 1000 }),
  });

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
        disabled && 'opacity-50'
      )}
    >
      <option value="">-- Chọn {label} --</option>
      {data?.items.map((item) => (
        <option key={String(item[fk.valueKey])} value={String(item[fk.valueKey])}>
          {String(item[fk.valueKey])} - {String(item[fk.displayKey] ?? '')}
        </option>
      ))}
    </select>
  );
}
