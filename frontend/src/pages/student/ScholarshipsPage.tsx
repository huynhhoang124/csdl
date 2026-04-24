import { useAuthStore } from '@/store/authStore';
import { useParticipation } from '@/hooks/useParticipation';
import { ActivityCard } from '@/components/shared/ActivityCard';

export function ScholarshipsPage() {
  const MSV = useAuthStore((s) => s.user?.MSV) ?? '';
  const { items, links, isLoading, isJoined, register, unregister } = useParticipation({
    mainTable: 'hocBong',
    linkTable: 'sinhVien_HocBong',
    MSV,
    foreignKey: 'maHocBong',
    extraFields: { ngayNhan: new Date().toISOString().slice(0, 10), phanTram: 100 },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Học bổng</h1>
        <p className="text-slate-500">
          Đang có <strong>{items.length}</strong> học bổng • Bạn đã nhận <strong>{links.length}</strong>
        </p>
      </div>

      {isLoading ? <p className="text-slate-500">Đang tải...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((hb) => {
            const id = String(hb.maHocBong);
            const joined = isJoined(id);
            return (
              <ActivityCard
                key={id}
                title={String(hb.tenHocBong ?? id)}
                badges={[String(hb.loaiHocBong ?? '')].filter(Boolean)}
                joined={joined}
                onToggle={() => joined ? unregister(id) : register(id)}
                fields={[
                  { label: 'Giá trị', value: Number(hb.giaTri ?? 0).toLocaleString() + ' VNĐ' },
                  { label: 'Điều kiện', value: String(hb.dieuKien ?? '—') },
                  { label: 'Đơn vị', value: String(hb.donViCungCap ?? '—') },
                ]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
