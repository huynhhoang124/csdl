import { useAuthStore } from '@/store/authStore';
import { useParticipation } from '@/hooks/useParticipation';
import { ActivityCard } from '@/components/shared/ActivityCard';
import { formatDate } from '@/lib/utils';

export function EventsPage() {
  const MSV = useAuthStore((s) => s.user?.MSV) ?? '';
  const { items, links, isLoading, isJoined, register, unregister } = useParticipation({
    mainTable: 'suKien',
    linkTable: 'sinhVien_SuKien',
    MSV,
    foreignKey: 'maSuKien',
    extraFields: { trangThai: 'Da dang ky' },
  });

  // Sắp xếp: sự kiện sắp diễn ra trước
  const sorted = [...items].sort((a, b) => {
    const aT = new Date(String(a.thoiGianBatDau ?? 0)).getTime();
    const bT = new Date(String(b.thoiGianBatDau ?? 0)).getTime();
    return aT - bT;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Sự kiện</h1>
        <p className="text-slate-500">
          <strong>{items.length}</strong> sự kiện • Bạn đăng ký <strong>{links.length}</strong>
        </p>
      </div>

      {isLoading ? <p className="text-slate-500">Đang tải...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((sk) => {
            const id = String(sk.maSuKien);
            const joined = isJoined(id);
            const batBuoc = Boolean(sk.batBuoc);
            return (
              <ActivityCard
                key={id}
                title={String(sk.tenSuKien ?? id)}
                badges={[
                  String(sk.loaiSuKien ?? ''),
                  String(sk.trangThai ?? ''),
                  batBuoc ? 'Bắt buộc' : '',
                ].filter(Boolean)}
                joined={joined}
                actionLabel={batBuoc ? 'Đánh dấu tham gia' : 'Đăng ký'}
                onToggle={() => joined ? unregister(id) : register(id)}
                fields={[
                  { label: 'Đơn vị', value: String(sk.donViToChuc ?? '—') },
                  { label: 'Địa điểm', value: String(sk.diaDiem ?? '—') },
                  { label: 'Bắt đầu', value: formatDate(sk.thoiGianBatDau as string) },
                  { label: 'Kết thúc', value: formatDate(sk.thoiGianKetThuc as string) },
                  { label: 'Tham gia', value: String(sk.soLuongThamGia ?? 0) },
                ]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
