/**
 * MockDatabase — in-memory DB sinh bằng faker (locale vi).
 * Dữ liệu phong phú đủ để demo toàn bộ chức năng offline.
 * Seed cố định để mỗi lần reload ra kết quả giống nhau.
 */
import { faker } from '@faker-js/faker/locale/vi';
import type {
  Ttcn, SinhVien, CanBo, Khoa, HeDaoTao, Bac,
  ChuongTrinhDaoTao, ChuyenNganh, Mon, MonDaoTao, MonTienQuyet,
  BangDiem, LopHanhChinh, LopTinChi,
  SinhVien_LopHanhChinh, SinhVien_LopTinChi,
  HocBong, SinhVien_HocBong,
  NghienCuu, SinhVien_NghienCuu,
  DoAnTN, SinhVien_DoAnTN,
  DuHoc, SinhVien_DuHoc,
  SuKien, SinhVien_SuKien,
} from '@qldh/shared';

faker.seed(20260422);

const DIEM_CHU = ['A+','A','B+','B','C+','C','D+','D','F'] as const;
const KHOA_LIST = [
  { code: 'CNTT', name: 'Cong nghe thong tin' },
  { code: 'DIEN', name: 'Dien - Dien tu' },
  { code: 'COKHI', name: 'Co khi' },
  { code: 'KT', name: 'Kinh te' },
  { code: 'NN', name: 'Ngoai ngu' },
];

export interface MockDB {
  ttcn: Ttcn[];
  sinhVien: SinhVien[];
  canBo: CanBo[];
  Khoa: Khoa[];
  heDaoTao: HeDaoTao[];
  bac: Bac[];
  chuongTrinhDaoTao: ChuongTrinhDaoTao[];
  chuyenNganh: ChuyenNganh[];
  mon: Mon[];
  monDaoTao: MonDaoTao[];
  monTienQuyet: MonTienQuyet[];
  bangDiem: BangDiem[];
  lopHanhChinh: LopHanhChinh[];
  lopTinChi: LopTinChi[];
  sinhVien_LopHanhChinh: SinhVien_LopHanhChinh[];
  sinhVien_LopTinChi: SinhVien_LopTinChi[];
  hocBong: HocBong[];
  sinhVien_HocBong: SinhVien_HocBong[];
  nghienCuu: NghienCuu[];
  sinhVien_NghienCuu: SinhVien_NghienCuu[];
  doAnTN: DoAnTN[];
  sinhVien_DoAnTN: SinhVien_DoAnTN[];
  duHoc: DuHoc[];
  sinhVien_DuHoc: SinhVien_DuHoc[];
  suKien: SuKien[];
  sinhVien_SuKien: SinhVien_SuKien[];
}

function genCCCD(i: number) { return String(1001000000001 + i).slice(0, 12); }
function genMSV(i: number) { return `SV${String(i + 1).padStart(4, '0')}`; }
function genMCB(i: number) { return `CB${String(i + 1).padStart(3, '0')}`; }
function pick<T>(arr: T[]): T { return arr[Math.floor(faker.number.float() * arr.length)]!; }
function dateISO(d: Date) { return d.toISOString().slice(0, 10); }

function diemToChu(diem: number): typeof DIEM_CHU[number] {
  if (diem >= 9.5) return 'A+';
  if (diem >= 8.5) return 'A';
  if (diem >= 8.0) return 'B+';
  if (diem >= 7.0) return 'B';
  if (diem >= 6.5) return 'C+';
  if (diem >= 5.5) return 'C';
  if (diem >= 5.0) return 'D+';
  if (diem >= 4.0) return 'D';
  return 'F';
}

function buildDB(): MockDB {
  // 1. TTCN — 200 hồ sơ
  const ttcn: Ttcn[] = Array.from({ length: 200 }, (_, i) => ({
    CCCD: genCCCD(i),
    lastName: faker.person.lastName(),
    name: faker.person.firstName(),
    ngaySinh: dateISO(faker.date.between({ from: '1970-01-01', to: '2007-12-31' })),
    gioiTinh: faker.helpers.arrayElement(['Nam', 'Nu']),
    soDienThoai: `09${faker.string.numeric(8)}`,
    ngayCapCCCD: dateISO(faker.date.between({ from: '2018-01-01', to: '2024-12-31' })),
    diaChiThuongTru: faker.location.streetAddress({ useFullAddress: true }),
    diaChiTamTru: faker.location.streetAddress(),
    quocTich: 'Viet Nam',
    danToc: faker.helpers.arrayElement(['Kinh', 'Kinh', 'Kinh', 'Tay', 'Thai', 'Muong']),
    congGiao: 'Khong',
    baoHiem: `BHYT${faker.string.numeric(6)}`,
  }));

  // 2. Cán bộ — 30 người (dùng 30 ttcn đầu tiên có tuổi > 25)
  const canBo: CanBo[] = Array.from({ length: 30 }, (_, i) => ({
    MCB: genMCB(i),
    CCCD: ttcn[i]!.CCCD,
    viTriCongViec: i < 5 ? 'Truong khoa' : 'Giang vien',
    trangThai: 'Dang cong tac',
  }));

  // 3. Sinh viên — 150 (dùng ttcn 50..199)
  const sinhVien: SinhVien[] = Array.from({ length: 150 }, (_, i) => {
    const gpa = Math.min(4, Math.max(1.5, faker.number.float({ min: 2, max: 3.9, fractionDigits: 2 })));
    return {
      MSV: genMSV(i),
      CCCD: ttcn[50 + i]!.CCCD,
      trangThai: faker.helpers.arrayElement(['Dang hoc', 'Dang hoc', 'Dang hoc', 'Bao luu']),
      namHoc: faker.helpers.arrayElement([2022, 2023, 2024, 2025, 2026]),
      khoaDaoTao: faker.helpers.arrayElement(['K62', 'K63', 'K64', 'K65', 'K66']),
      tenNganHang: faker.helpers.arrayElement(['VCB', 'BIDV', 'Techcombank', 'MB Bank', 'VPBank']),
      soTaiKhoan: `19${faker.string.numeric(10)}`,
      GPA: gpa,
      CPA: +(gpa - faker.number.float({ min: 0, max: 0.3, fractionDigits: 2 })).toFixed(2),
    };
  });

  // 4. Khoa — 5
  const Khoa: Khoa[] = KHOA_LIST.map((k, i) => ({
    maKhoa: k.code,
    MCB: canBo[i]!.MCB,
    vanPhongKhoa: `Tang ${i + 2} toa A1`,
    dienThoaiLienHe: `02473${faker.string.numeric(6)}`,
    emailLienHe: `${k.code.toLowerCase()}@university.edu.vn`,
    moTa: `Khoa ${k.name}`,
    ngayThanhLap: dateISO(faker.date.past({ years: 25 })),
  }));

  // 5. Hệ đào tạo
  const heDaoTao: HeDaoTao[] = [
    { maHe: 'CQ', tenHe: 'Chinh quy', donVi: 'Truong DH', yeuCauDauVao: 'Tot nghiep THPT' },
    { maHe: 'LT', tenHe: 'Lien thong', donVi: 'Truong DH', yeuCauDauVao: 'Tot nghiep CD' },
    { maHe: 'CLC', tenHe: 'Chat luong cao', donVi: 'Truong DH', yeuCauDauVao: 'Dat chuan IELTS 6.0' },
  ];

  const bac: Bac[] = [
    { maBac: 'DH', tenBac: 'Dai hoc', thoiGianDaoTao: 4, dieuKien: 'Toi thieu 130 tin chi' },
    { maBac: 'CD', tenBac: 'Cao dang', thoiGianDaoTao: 3, dieuKien: 'Toi thieu 90 tin chi' },
    { maBac: 'ThS', tenBac: 'Thac si', thoiGianDaoTao: 2, dieuKien: 'Co bang DH' },
  ];

  // 6. Chương trình — 8
  const chuongTrinhDaoTao: ChuongTrinhDaoTao[] = Khoa.flatMap((k, i) => [
    { maCT: `CT${k.maKhoa}1`, tenCT: `CT ${k.maKhoa} 1`, tenDonVi: `Khoa ${k.maKhoa}`, giamDoc: canBo[i]!.MCB },
  ]).concat([
    { maCT: 'CTCNTT2', tenCT: 'CT CNTT Chat luong cao', tenDonVi: 'Khoa CNTT', giamDoc: canBo[0]!.MCB },
    { maCT: 'CTKT2', tenCT: 'CT Kinh te Quoc te', tenDonVi: 'Khoa KT', giamDoc: canBo[3]!.MCB },
    { maCT: 'CTNN2', tenCT: 'CT Ngoai ngu nang cao', tenDonVi: 'Khoa NN', giamDoc: canBo[4]!.MCB },
  ]);

  // 7. Chuyên ngành — 15 (3 per khoa)
  const CN_NAMES: Record<string, string[]> = {
    CNTT: ['Cong nghe phan mem', 'Khoa hoc may tinh', 'An toan thong tin'],
    DIEN: ['Dien tu vien thong', 'Tu dong hoa', 'Dien cong nghiep'],
    COKHI: ['Co khi che tao', 'Co dien tu', 'Oto'],
    KT: ['Tai chinh ngan hang', 'Ke toan', 'Quan tri kinh doanh'],
    NN: ['Tieng Anh', 'Tieng Nhat', 'Tieng Trung'],
  };
  const chuyenNganh: ChuyenNganh[] = Khoa.flatMap((k) =>
    (CN_NAMES[k.maKhoa] ?? []).map((name, j) => ({
      maChuyenNganh: `${k.maKhoa}${j + 1}`,
      maKhoa: k.maKhoa,
      maHe: 'CQ',
      maBac: 'DH',
      tenChuyenNganh: name,
      soTinChi: 130,
      bangCap: 'Cu nhan',
      dieuKien: 'GPA >= 2.0',
    }))
  );

  // 8. Môn — 80 (16 per khoa trung bình)
  const mon: Mon[] = [];
  Khoa.forEach((k, kIdx) => {
    for (let i = 0; i < 16; i++) {
      mon.push({
        maMon: `${k.maKhoa}${101 + i + kIdx * 20}`,
        maKhoa: k.maKhoa,
        tenMon: `Mon ${k.maKhoa} ${i + 1}`,
        kieuMonHoc: faker.helpers.arrayElement(['Bat buoc', 'Tu chon', 'Chuyen nganh']),
        moTa: `Mon hoc cua khoa ${k.maKhoa}`,
      });
    }
  });

  // 9. monDaoTao — map 200 entries
  const monDaoTao: MonDaoTao[] = [];
  chuyenNganh.forEach((cn) => {
    const khoaMons = mon.filter((m) => m.maKhoa === cn.maKhoa).slice(0, 14);
    const ct = chuongTrinhDaoTao.find((c) => c.maCT.includes(cn.maKhoa))!;
    khoaMons.forEach((m) => {
      monDaoTao.push({
        maCT: ct.maCT,
        maMon: m.maMon,
        maChuyenNganh: cn.maChuyenNganh,
        soTinChi: faker.helpers.arrayElement([2, 3, 3, 3, 4]),
        soTietLyThuyet: 30,
        soTietThucHanh: faker.helpers.arrayElement([15, 30]),
        hocPhi: faker.helpers.arrayElement([3000000, 3500000, 4000000, 4500000]),
      });
    });
  });

  // 10. monTienQuyet — 50 chuỗi
  const monTienQuyet: MonTienQuyet[] = [];
  for (let i = 0; i < Math.min(50, monDaoTao.length - 1); i++) {
    const current = monDaoTao[i + 1]!;
    const prev = monDaoTao[i]!;
    if (prev.maChuyenNganh === current.maChuyenNganh) {
      monTienQuyet.push({
        maCT: current.maCT,
        maMon: current.maMon,
        maChuyenNganh: current.maChuyenNganh,
        maTienQuyet: prev.maMon,
        moTa: `Hoan thanh ${prev.maMon} truoc`,
      });
    }
  }

  // 11. bangDiem — 10-20 môn mỗi SV
  const bangDiem: BangDiem[] = [];
  sinhVien.forEach((sv) => {
    const n = faker.number.int({ min: 10, max: 20 });
    const picks = faker.helpers.arrayElements(mon, n);
    picks.forEach((m) => {
      const diem = +faker.number.float({ min: 3, max: 10, fractionDigits: 1 }).toFixed(1);
      bangDiem.push({ maMon: m.maMon, MSV: sv.MSV, diemSo: diem, diemChu: diemToChu(diem) });
    });
  });

  // 12. Lớp hành chính — 15
  const lopHanhChinh: LopHanhChinh[] = chuyenNganh.map((cn, i) => ({
    maLop: `K${63 + (i % 4)}${cn.maChuyenNganh}`,
    maHe: 'CQ',
    maBac: 'DH',
    maChuyenNganh: cn.maChuyenNganh,
    coVanhocTap: canBo[5 + (i % 20)]!.MCB,
    siSo: 10,
    moTa: `Lop ${cn.tenChuyenNganh}`,
  }));

  // 13. Lớp tín chỉ — 40 (qua 3 kỳ)
  const lopTinChi: LopTinChi[] = [];
  [20261, 20262, 20263].forEach((ky, kyIdx) => {
    for (let i = 0; i < 14; i++) {
      const m = mon[(kyIdx * 14 + i) % mon.length]!;
      lopTinChi.push({
        maLop: `LTC${ky}${String(i + 1).padStart(2, '0')}`,
        MCB: canBo[5 + (i % 25)]!.MCB,
        maMon: m.maMon,
        kyDaoTao: ky,
        soLuongSinhVienMax: 60,
        soLuongSinhVien: faker.number.int({ min: 10, max: 50 }),
        trangThai: ky === 20263 ? 'Sap mo' : 'Dang mo',
      });
    }
  });

  // 14. sinhVien_LopHanhChinh — mỗi SV 1 lớp
  const sinhVien_LopHanhChinh: SinhVien_LopHanhChinh[] = sinhVien.map((sv, i) => ({
    MSV: sv.MSV,
    maLop: lopHanhChinh[i % lopHanhChinh.length]!.maLop,
  }));

  // 15. sinhVien_LopTinChi — 4-5 lớp/SV/kỳ
  const sinhVien_LopTinChi: SinhVien_LopTinChi[] = [];
  sinhVien.forEach((sv) => {
    const picks = faker.helpers.arrayElements(lopTinChi, faker.number.int({ min: 4, max: 6 }));
    picks.forEach((l) => {
      sinhVien_LopTinChi.push({ MSV: sv.MSV, maLop: l.maLop, ngayDangKy: dateISO(new Date(2026, 0, 10)) });
    });
  });

  // 16. Học bổng — 10
  const hocBong: HocBong[] = Array.from({ length: 10 }, (_, i) => ({
    maHocBong: `HB${String(i + 1).padStart(3, '0')}`,
    tenHocBong: faker.helpers.arrayElement([
      'Hoc bong khuyen khich', 'Hoc bong doanh nghiep', 'Hoc bong kho khan',
      'Hoc bong tai nang', 'Hoc bong the thao',
    ]) + ` loai ${i + 1}`,
    loaiHocBong: faker.helpers.arrayElement(['Thanh tich', 'Tai tro', 'Kho khan']),
    dieuKien: 'GPA >= 3.5',
    giaTri: faker.helpers.arrayElement([3000000, 5000000, 7000000, 10000000]),
    moTa: 'Hoc bong danh cho sinh vien',
    donViCungCap: 'Truong / Doanh nghiep',
  }));

  // 17. sinhVien_HocBong — top 40 GPA nhận
  const topSV = [...sinhVien].sort((a, b) => (b.GPA ?? 0) - (a.GPA ?? 0)).slice(0, 40);
  const sinhVien_HocBong: SinhVien_HocBong[] = topSV.map((sv, i) => ({
    MSV: sv.MSV,
    maHocBong: hocBong[i % hocBong.length]!.maHocBong,
    ngayNhan: dateISO(faker.date.recent({ days: 180 })),
    phanTram: faker.helpers.arrayElement([50, 75, 100]),
  }));

  // 18. Nghiên cứu — 15
  const nghienCuu: NghienCuu[] = Array.from({ length: 15 }, (_, i) => ({
    maDeTai: `DT${String(i + 1).padStart(3, '0')}`,
    tenDeTai: `De tai nghien cuu ${i + 1}`,
    capDeTai: faker.helpers.arrayElement(['Cap truong', 'Cap khoa', 'Cap bo']),
    phanLoai: 'Ung dung',
    donVi: `Khoa ${pick(Khoa).maKhoa}`,
    kinhPhi: faker.helpers.arrayElement([10_000_000, 20_000_000, 50_000_000]),
    thoiGianBatDau: dateISO(new Date(2026, 0, 1)),
    thoiGianKetThuc: dateISO(new Date(2026, 11, 31)),
    moTa: 'Nghien cuu khoa hoc',
  }));

  const sinhVien_NghienCuu: SinhVien_NghienCuu[] = nghienCuu.flatMap((nc, i) => {
    const members = faker.helpers.arrayElements(sinhVien, faker.number.int({ min: 1, max: 3 }));
    return members.map((sv, j) => ({
      MSV: sv.MSV,
      maDeTai: nc.maDeTai,
      vaiTro: j === 0 ? 'Chu nhiem' : 'Thanh vien',
      ngayThamGia: dateISO(new Date(2026, 0, 15)),
    }));
  });

  // 19. Đồ án TN — 20
  const doAnTN: DoAnTN[] = Array.from({ length: 20 }, (_, i) => ({
    maDoAn: `DATN${String(i + 1).padStart(3, '0')}`,
    tenDoAn: `Do an tot nghiep ${i + 1}`,
    trangThai: faker.helpers.arrayElement(['Dang thuc hien', 'Da bao ve', 'Chua bat dau']),
    diem: faker.number.float({ min: 6, max: 10, fractionDigits: 1 }),
    ngayBatDau: dateISO(new Date(2026, 2, 1)),
    ngayBaoVe: dateISO(new Date(2026, 7, 15)),
    bacDoAn: 'Dai hoc',
    moTa: 'Do an tot nghiep',
    dinhKem: `doan/datn${i + 1}.pdf`,
  }));

  const sinhVien_DoAnTN: SinhVien_DoAnTN[] = doAnTN.map((da, i) => ({
    MSV: sinhVien[i % sinhVien.length]!.MSV,
    maDoAn: da.maDoAn,
    vaiTro: 'Tac gia',
  }));

  // 20. Du học — 8
  const duHoc: DuHoc[] = Array.from({ length: 8 }, (_, i) => ({
    maSuat: `DH${String(i + 1).padStart(3, '0')}`,
    tenChuongTrinh: `Du hoc ${faker.helpers.arrayElement(['Han Quoc','Nhat Ban','My','Duc','Uc'])} ${i + 1}`,
    loaiHinh: faker.helpers.arrayElement(['Trao doi', 'Hoc bong toan phan']),
    hocBong: faker.datatype.boolean(),
    donVi: 'Phong HTQT',
    chuyenNganh: pick(chuyenNganh).tenChuyenNganh ?? '',
    kinhPhiTaiTro: faker.helpers.arrayElement([50_000_000, 100_000_000, 200_000_000]),
    bac: 'Dai hoc',
    namBatDau: 2026,
    namKetThuc: 2027,
    dieuKien: 'IELTS 6.0, GPA >= 3.2',
    trangThai: 'Dang mo',
    quocGiaTheoHoc: faker.helpers.arrayElement(['Han Quoc','Nhat Ban','My','Duc','Uc']),
    donViTheoHoc: 'Partner University',
    moTa: 'Chuong trinh du hoc',
  }));

  const sinhVien_DuHoc: SinhVien_DuHoc[] = duHoc.flatMap((d, i) =>
    faker.helpers.arrayElements(sinhVien, 2).map((sv) => ({
      MSV: sv.MSV,
      maSuat: d.maSuat,
      trangThai: faker.helpers.arrayElement(['Cho duyet', 'Duoc duyet', 'Tu choi']),
      ngayDangKy: dateISO(faker.date.recent({ days: 90 })),
    }))
  );

  // 21. Sự kiện — 25
  const suKien: SuKien[] = Array.from({ length: 25 }, (_, i) => ({
    maSuKien: `SK${String(i + 1).padStart(3, '0')}`,
    tenSuKien: faker.helpers.arrayElement([
      'Tuan sinh hoat cong dan', 'Ngay hoi viec lam', 'Hoi thao khoa hoc',
      'Le khai giang', 'Le tot nghiep', 'Festival sinh vien',
    ]) + ` ${i + 1}`,
    donViToChuc: 'Phong CTSV',
    soLuongThamGia: faker.number.int({ min: 50, max: 500 }),
    diaDiem: faker.helpers.arrayElement(['Hoi truong lon', 'San truong', 'Phong hop A1']),
    thoiGianBatDau: faker.date.future({ years: 1 }).toISOString(),
    thoiGianKetThuc: faker.date.future({ years: 1 }).toISOString(),
    trangThai: faker.helpers.arrayElement(['Sap dien ra', 'Da ket thuc', 'Dang dien ra']),
    moTa: 'Su kien sinh vien',
    loaiSuKien: faker.helpers.arrayElement(['Sinh hoat', 'Huong nghiep', 'Hoc thuat']),
    batBuoc: faker.datatype.boolean(),
  }));

  const sinhVien_SuKien: SinhVien_SuKien[] = suKien.flatMap((sk) =>
    faker.helpers.arrayElements(sinhVien, faker.number.int({ min: 5, max: 15 })).map((sv) => ({
      MSV: sv.MSV,
      maSuKien: sk.maSuKien,
      trangThai: faker.helpers.arrayElement(['Da dang ky', 'Da tham gia', 'Huy']),
    }))
  );

  return {
    ttcn, sinhVien, canBo, Khoa, heDaoTao, bac,
    chuongTrinhDaoTao, chuyenNganh, mon, monDaoTao, monTienQuyet,
    bangDiem, lopHanhChinh, lopTinChi,
    sinhVien_LopHanhChinh, sinhVien_LopTinChi,
    hocBong, sinhVien_HocBong,
    nghienCuu, sinhVien_NghienCuu,
    doAnTN, sinhVien_DoAnTN,
    duHoc, sinhVien_DuHoc,
    suKien, sinhVien_SuKien,
  };
}

export const db: MockDB = buildDB();

/** Reset DB về seed ban đầu */
export function resetDB() {
  faker.seed(20260422);
  const fresh = buildDB();
  (Object.keys(fresh) as Array<keyof MockDB>).forEach((k) => {
    (db[k] as unknown[]).length = 0;
    (db[k] as unknown[]).push(...(fresh[k] as unknown[]));
  });
}
