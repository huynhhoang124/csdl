import { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, MarkerType, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Các mối quan hệ FK chính trong schema
const RELATIONS: Array<[from: string, to: string, label?: string]> = [
  ['sinhVien', 'ttcn', 'CCCD'],
  ['canBo', 'ttcn', 'CCCD'],
  ['Khoa', 'canBo', 'MCB'],
  ['chuyenNganh', 'Khoa', 'maKhoa'],
  ['chuyenNganh', 'heDaoTao', 'maHe'],
  ['chuyenNganh', 'bac', 'maBac'],
  ['mon', 'Khoa', 'maKhoa'],
  ['monDaoTao', 'chuongTrinhDaoTao', 'maCT'],
  ['monDaoTao', 'mon', 'maMon'],
  ['monDaoTao', 'chuyenNganh', 'maChuyenNganh'],
  ['monTienQuyet', 'monDaoTao', '(composite)'],
  ['monTienQuyet', 'mon', 'maTienQuyet'],
  ['bangDiem', 'sinhVien', 'MSV'],
  ['bangDiem', 'mon', 'maMon'],
  ['lopHanhChinh', 'chuyenNganh', 'maChuyenNganh'],
  ['lopHanhChinh', 'canBo', 'coVanhocTap'],
  ['lopTinChi', 'canBo', 'MCB'],
  ['lopTinChi', 'mon', 'maMon'],
  ['sinhVien_LopHanhChinh', 'sinhVien', 'MSV'],
  ['sinhVien_LopHanhChinh', 'lopHanhChinh', 'maLop'],
  ['sinhVien_LopTinChi', 'sinhVien', 'MSV'],
  ['sinhVien_LopTinChi', 'lopTinChi', 'maLop'],
  ['sinhVien_HocBong', 'sinhVien', 'MSV'],
  ['sinhVien_HocBong', 'hocBong', 'maHocBong'],
  ['sinhVien_NghienCuu', 'sinhVien', 'MSV'],
  ['sinhVien_NghienCuu', 'nghienCuu', 'maDeTai'],
  ['sinhVien_DoAnTN', 'sinhVien', 'MSV'],
  ['sinhVien_DoAnTN', 'doAnTN', 'maDoAn'],
  ['sinhVien_DuHoc', 'sinhVien', 'MSV'],
  ['sinhVien_DuHoc', 'duHoc', 'maSuat'],
  ['sinhVien_SuKien', 'sinhVien', 'MSV'],
  ['sinhVien_SuKien', 'suKien', 'maSuKien'],
];

// Bố trí thủ công: nhóm theo cluster
const POSITIONS: Record<string, { x: number; y: number; color: string }> = {
  // Core identity (trái)
  ttcn: { x: 0, y: 200, color: '#6366f1' },
  sinhVien: { x: 200, y: 80, color: '#8b5cf6' },
  canBo: { x: 200, y: 320, color: '#8b5cf6' },
  Khoa: { x: 420, y: 320, color: '#10b981' },
  // Training framework (giữa trên)
  heDaoTao: { x: 420, y: 0, color: '#f59e0b' },
  bac: { x: 600, y: 0, color: '#f59e0b' },
  chuongTrinhDaoTao: { x: 780, y: 0, color: '#f59e0b' },
  chuyenNganh: { x: 600, y: 160, color: '#10b981' },
  // Courses (giữa)
  mon: { x: 780, y: 200, color: '#d946ef' },
  monDaoTao: { x: 960, y: 160, color: '#d946ef' },
  monTienQuyet: { x: 1140, y: 160, color: '#d946ef' },
  bangDiem: { x: 960, y: 340, color: '#ec4899' },
  // Classes
  lopHanhChinh: { x: 420, y: 500, color: '#0ea5e9' },
  lopTinChi: { x: 780, y: 500, color: '#0ea5e9' },
  sinhVien_LopHanhChinh: { x: 220, y: 620, color: '#94a3b8' },
  sinhVien_LopTinChi: { x: 600, y: 620, color: '#94a3b8' },
  // Activities (dưới)
  hocBong: { x: 0, y: 780, color: '#f97316' },
  sinhVien_HocBong: { x: 200, y: 780, color: '#94a3b8' },
  nghienCuu: { x: 420, y: 780, color: '#f97316' },
  sinhVien_NghienCuu: { x: 620, y: 780, color: '#94a3b8' },
  doAnTN: { x: 840, y: 780, color: '#f97316' },
  sinhVien_DoAnTN: { x: 1040, y: 780, color: '#94a3b8' },
  duHoc: { x: 0, y: 920, color: '#f97316' },
  sinhVien_DuHoc: { x: 200, y: 920, color: '#94a3b8' },
  suKien: { x: 420, y: 920, color: '#f97316' },
  sinhVien_SuKien: { x: 620, y: 920, color: '#94a3b8' },
};

export function ERDiagramPage() {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = Object.entries(POSITIONS).map(([name, pos]) => ({
      id: name,
      position: { x: pos.x, y: pos.y },
      data: { label: name },
      style: {
        background: pos.color,
        color: 'white',
        border: 'none',
        borderRadius: 8,
        padding: '6px 10px',
        fontSize: 11,
        fontFamily: 'monospace',
        fontWeight: 600,
        minWidth: 120,
        textAlign: 'center' as const,
      },
    }));

    const edges: Edge[] = RELATIONS.map(([from, to, label], i) => ({
      id: `${from}-${to}-${i}`,
      source: from,
      target: to,
      label,
      style: { stroke: '#94a3b8', strokeWidth: 1.5 },
      labelStyle: { fontSize: 10, fill: '#64748b' },
      labelBgStyle: { fill: 'white' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
      animated: false,
    }));

    return { nodes, edges };
  }, []);

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-display font-bold">ER Diagram</h1>
        <p className="text-slate-500">Sơ đồ quan hệ 26 bảng • Kéo/zoom để khám phá</p>
      </div>
      <Card className="flex-1">
        <CardContent className="p-0 h-full">
          <div className="w-full h-full rounded-xl overflow-hidden">
            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background gap={24} color="#cbd5e1" />
              <Controls />
              <MiniMap zoomable pannable />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm">Chú giải màu</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-xs">
          <Legend color="#6366f1" label="Core identity (ttcn)" />
          <Legend color="#8b5cf6" label="Người dùng (SV/CB)" />
          <Legend color="#10b981" label="Cấu trúc (Khoa/CN)" />
          <Legend color="#f59e0b" label="Khung đào tạo" />
          <Legend color="#d946ef" label="Học phần" />
          <Legend color="#ec4899" label="Điểm" />
          <Legend color="#0ea5e9" label="Lớp" />
          <Legend color="#f97316" label="Hoạt động" />
          <Legend color="#94a3b8" label="Bảng liên kết" />
        </CardContent>
      </Card>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="size-3 rounded" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}
