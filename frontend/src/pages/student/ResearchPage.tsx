import { useAuthStore } from '@/store/authStore';
import { useParticipation } from '@/hooks/useParticipation';
import { ActivityCard } from '@/components/shared/ActivityCard';
import { formatDate } from '@/lib/utils';

export function ResearchPage() {
  const MSV = useAuthStore((s) => s.user?.MSV) ?? '';
  const { items, links, isLoading, isJoined, register, unregister } = useParticipation({
    mainTable: 'nghienCuu',
    linkTable: 'sinhVien_NghienCuu',
    MSV,
    foreignKey: 'maDeTai',
    extraFields: {
      vaiTro: 'Thanh vien',
      ngayThamGia: new Date().toISOString().slice(0, 10),
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Nghiên cứu khoa học</h1>
        <p className="text-slate-500">
          Có <strong>{items.length}</strong> đề tài • Bạn đang tham gia <strong>{links.length}</strong>
        </p>
      </div>

      {isLoading ? <p className="text-slate-500">Đang tải...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((nc) => {
            const id = String(nc.maDeTai);
            const joined = isJoined(id);
            return (
              <ActivityCard
                key={id}
                title={String(nc.tenDeTai ?? id)}
                badges={[String(nc.capDeTai ?? ''), String(nc.phanLoai ?? '')].filter(Boolean)}
                joined={joined}
                actionLabel="Đăng ký tham gia"
                onToggle={() => joined ? unregister(id) : register(id)}
                fields={[
                  { label: 'Đơn vị', value: String(nc.donVi ?? '—') },
                  { label: 'Kinh phí', value: Number(nc.kinhPhi ?? 0).toLocaleString() + ' VNĐ' },
                  { label: 'Bắt đầu', value: formatDate(nc.thoiGianBatDau as string) },
                  { label: 'Kết thúc', value: formatDate(nc.thoiGianKetThuc as string) },
                ]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
