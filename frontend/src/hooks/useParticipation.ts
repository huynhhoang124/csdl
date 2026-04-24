/**
 * Hook chung cho các activity page của sinh viên:
 * - Danh sách item (bảng chính: hocBong, nghienCuu, suKien, duHoc, doAnTN)
 * - Danh sách SV đã tham gia (bảng liên kết: sinhVien_*)
 * - Đăng ký / Hủy đăng ký
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { repositories } from '@/lib/api';
import type { TableName } from '@qldh/shared';

interface Options {
  mainTable: TableName;
  linkTable: TableName;
  MSV: string;
  foreignKey: string;        // VD 'maHocBong', 'maDeTai', 'maSuKien'...
  extraFields?: Record<string, unknown>; // thêm vào record khi đăng ký (ngày, trạng thái...)
}

export function useParticipation({ mainTable, linkTable, MSV, foreignKey, extraFields }: Options) {
  const qc = useQueryClient();

  const mainQuery = useQuery({
    queryKey: ['activity-main', mainTable],
    queryFn: () => repositories.generic.list(mainTable, { pageSize: 100 }),
  });

  const linksQuery = useQuery({
    queryKey: ['activity-link', linkTable, MSV],
    queryFn: () => repositories.generic.list(linkTable, { search: MSV, pageSize: 200 }),
    enabled: !!MSV,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['activity-link', linkTable, MSV] });
  };

  const register = useMutation({
    mutationFn: (fkValue: string) =>
      repositories.generic.create(linkTable, { MSV, [foreignKey]: fkValue, ...extraFields }),
    onSuccess: () => { toast.success('Đã đăng ký'); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Đăng ký thất bại'),
  });

  const unregister = useMutation({
    mutationFn: (fkValue: string) =>
      repositories.generic.delete(linkTable, { MSV, [foreignKey]: fkValue }),
    onSuccess: () => { toast.success('Đã hủy'); invalidate(); },
  });

  const items = (mainQuery.data?.items ?? []) as Record<string, unknown>[];
  const links = (linksQuery.data?.items ?? []) as Record<string, unknown>[];
  const joinedSet = new Set(links.filter((l) => l.MSV === MSV).map((l) => String(l[foreignKey])));

  return {
    items,
    links: links.filter((l) => l.MSV === MSV),
    isLoading: mainQuery.isLoading || linksQuery.isLoading,
    isJoined: (id: string) => joinedSet.has(id),
    register: register.mutate,
    unregister: unregister.mutate,
    isRegistering: register.isPending || unregister.isPending,
  };
}
