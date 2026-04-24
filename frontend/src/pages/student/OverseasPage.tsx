import { useAuthStore } from '@/store/authStore';
import { useParticipation } from '@/hooks/useParticipation';
import { ActivityCard } from '@/components/shared/ActivityCard';

export function OverseasPage() {
  const MSV = useAuthStore((s) => s.user?.MSV) ?? '';
  const { items, links, isLoading, isJoined, register, unregister } = useParticipation({
    mainTable: 'duHoc',
    linkTable: 'sinhVien_DuHoc',
    MSV,
    foreignKey: 'maSuat',
    extraFields: {
      trangThai: 'Cho duyet',
      ngayDangKy: new Date().toISOString().slice(0, 10),
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Du học</h1>
        <p className="text-slate-500">
          Có <strong>{items.length}</strong> suất du học • Bạn đã đăng ký <strong>{links.length}</strong>
        </p>
      </div>

      {isLoading ? <p className="text-slate-500">Đang tải...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((dh) => {
            const id = String(dh.maSuat);
            const joined = isJoined(id);
            return (
              <ActivityCard
                key={id}
                title={String(dh.tenChuongTrinh ?? id)}
                badges={[
                  String(dh.quocGiaTheoHoc ?? ''),
                  String(dh.loaiHinh ?? ''),
                  dh.hocBong ? 'Có học bổng' : '',
                ].filter(Boolean)}
                joined={joined}
                actionLabel="Nộp hồ sơ"
                onToggle={() => joined ? unregister(id) : register(id)}
                fields={[
                  { label: 'Chuyên ngành', value: String(dh.chuyenNganh ?? '—') },
                  { label: 'Đơn vị', value: String(dh.donViTheoHoc ?? '—') },
                  { label: 'Kinh phí', value: Number(dh.kinhPhiTaiTro ?? 0).toLocaleString() + ' VNĐ' },
                  { label: 'Thời gian', value: `${dh.namBatDau}-${dh.namKetThuc}` },
                  { label: 'Điều kiện', value: String(dh.dieuKien ?? '—') },
                ]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
