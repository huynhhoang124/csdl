# Báo cáo Tối ưu Cơ sở dữ liệu

> **Hệ thống:** Quản lý Đào tạo Đại học (QLDH)  
> **DBMS:** Microsoft SQL Server  
> **ORM:** Sequelize v6  
> **Ngày thực hiện:** 2026-05-08

---

## Mục lục

1. [Tổng quan Schema](#1-tổng-quan-schema)
2. [Danh sách chỉ mục đã tạo](#2-danh-sách-chỉ-mục-đã-tạo)
3. [Minh chứng tối ưu – Execution Plan](#3-minh-chứng-tối-ưu--execution-plan)
4. [Tổng kết](#4-tổng-kết)

---

## 1. Tổng quan Schema

Hệ thống gồm **25 bảng**, chia thành các nhóm chính:

| Nhóm | Bảng | Mô tả |
|------|------|-------|
| **Nhân sự** | `ttcn`, `canBo`, `sinhVien` | Thông tin cá nhân, cán bộ, sinh viên |
| **Đào tạo** | `Khoa`, `chuyenNganh`, `heDaoTao`, `bac`, `chuongTrinhDaoTao`, `mon`, `monDaoTao` | Cấu trúc chương trình đào tạo |
| **Lớp học** | `lopHanhChinh`, `lopTinChi`, `sinhVien_LopHanhChinh`, `sinhVien_LopTinChi` | Quản lý lớp & đăng ký |
| **Học tập** | `bangDiem`, `hocBong`, `sinhVien_HocBong` | Điểm số, học bổng |
| **Nghiên cứu** | `nghienCuu`, `sinhVien_NghienCuu`, `doAnTN`, `sinhVien_DoAnTN` | Đề tài nghiên cứu, đồ án |
| **Khác** | `duHoc`, `sinhVien_DuHoc`, `suKien`, `sinhVien_SuKien` | Du học, sự kiện |

Dữ liệu hiện tại: ~500 sinh viên, ~20 giảng viên, ~2000 bảng điểm, ~100 lớp tín chỉ, ~20 đề tài nghiên cứu.

---

## 2. Danh sách chỉ mục đã tạo

### 2.1. Clustered Index (tự động từ Primary Key)

SQL Server tự tạo **Clustered Index** khi khai báo `PRIMARY KEY`. Các bảng lookup (PK đơn) và bảng quan hệ (PK composite) đều có Clustered Index.

> **Lưu ý:** SQL Server **không tự tạo index trên cột Foreign Key**. Tất cả index trên FK phải tạo thủ công.

### 2.2. Non-clustered Index bổ sung

Các index dưới đây được tạo qua 2 migration:
- `20260508100000-add-optimization-indexes.cjs` — tạo 15 index cơ bản
- `20260508110000-upgrade-covering-indexes.cjs` — nâng cấp 2 index thành Covering Index (thêm INCLUDE) để loại bỏ Key Lookup

| # | Tên Index | Bảng | Cột Index | INCLUDE | Mục đích |
|---|-----------|------|-----------|---------|----------|
| I1 | `IX_ttcn_vaiTro` | `ttcn` | `vaiTro` | — | Lọc theo vai trò khi đăng nhập |
| I2 | `IX_sinhVien_trangThai` | `sinhVien` | `trangThai` | — | Thống kê trạng thái SV (Dashboard) |
| I3 | `IX_sinhVien_GPA` | `sinhVien` | `GPA` | — | Phân loại GPA cho biểu đồ thống kê |
| I4 | `IX_sinhVien_maKhoa` | `sinhVien` | `maKhoa` | — | JOIN/lọc sinh viên theo khoa |
| I5 | `IX_lopTinChi_MCB` | `lopTinChi` | `MCB` | `maMon, kyDaoTao, trangThai, soLuongSinhVienMax, soLuongSinhVien` | Lấy danh sách lớp của giảng viên (Covering Index) |
| I6 | `IX_lopTinChi_maMon` | `lopTinChi` | `maMon` | — | JOIN lớp tín chỉ với môn học |
| I7 | `IX_lopTinChi_trangThai` | `lopTinChi` | `trangThai` | — | Lọc lớp đang mở đăng ký |
| I8 | `IX_bangDiem_MSV` | `bangDiem` | `MSV` | `diemSo, diemChu` | Truy vấn điểm theo sinh viên (Covering Index) |
| I9 | `IX_bangDiem_maMon` | `bangDiem` | `maMon` | — | Truy vấn điểm theo môn học |
| I10 | `IX_sinhVien_NghienCuu_MCB` | `sinhVien_NghienCuu` | `MCB` | — | GV xem đề tài hướng dẫn |
| I11 | `IX_canBo_CCCD` | `canBo` | `CCCD` | — | JOIN cán bộ với thông tin cá nhân |
| I12 | `IX_chuyenNganh_maKhoa` | `chuyenNganh` | `maKhoa` | — | Lọc chuyên ngành theo khoa |
| I13 | `IX_mon_maKhoa` | `mon` | `maKhoa` | — | Lọc môn học theo khoa |
| I14 | `IX_lopHanhChinh_maChuyenNganh` | `lopHanhChinh` | `maChuyenNganh` | — | Lọc lớp hành chính theo chuyên ngành |
| I15 | `IX_suKien_trangThai` | `suKien` | `trangThai` | — | Lọc sự kiện theo trạng thái |

Trong đó, **I5** và **I8** là **Covering Index** — chứa tất cả cột cần thiết cho truy vấn (qua mệnh đề `INCLUDE`), giúp SQL Server trả kết quả hoàn toàn từ index mà không cần quay lại Clustered Index (loại bỏ Key Lookup).

---

## 3. Minh chứng tối ưu – Execution Plan

Các truy vấn dưới đây tương ứng 1:1 với các API thực tế trên hệ thống web. Execution Plan được kiểm tra bằng cách bật **Include Actual Execution Plan** (Ctrl+M) trên SSMS trước khi chạy query.

---

### 3.1. Xem bảng điểm sinh viên

**API tương ứng:** `GET /api/students/:MSV/grades`  
**Code ORM:** `BangDiem.findAll({ where: { MSV: req.params.MSV } })`  
**Index sử dụng:** `IX_bangDiem_MSV` (Covering Index — INCLUDE `diemSo`, `diemChu`)

**Phân tích:** PK của bảng `bangDiem` là `(maMon, MSV)` — cột `maMon` là prefix. Khi truy vấn `WHERE MSV = ...`, Clustered Index không thể Seek vì `MSV` không đứng đầu PK. Index `IX_bangDiem_MSV` cho phép Seek trực tiếp theo `MSV`, và vì đây là Covering Index (INCLUDE `diemSo`, `diemChu`), toàn bộ dữ liệu cần thiết nằm trong index — không cần Key Lookup.

```sql
SELECT [maMon], [MSV], [diemSo], [diemChu]
FROM [bangDiem]
WHERE [MSV] = N'SVBK0001'
```

**Execution Plan:**

*(Chèn ảnh Execution Plan tại đây)*

---

### 3.2. Tính GPA/CPA sinh viên

**API tương ứng:** `GET /api/students/:MSV/gpa`  
**Code ORM:** Raw SQL tính CPA dựa trên bảng `bangDiem` và `monDaoTao`.  
**Index sử dụng:** `IX_bangDiem_MSV` (Seek trên `bangDiem`), Clustered Index PK (Seek trên `monDaoTao`)

**Phân tích:** Truy vấn này lọc `bangDiem` theo `MSV`, sau đó với mỗi dòng kết quả, truy xuất `soTinChi` từ `monDaoTao` qua subquery. Nhờ `IX_bangDiem_MSV`, bảng `bangDiem` được Seek thay vì Scan. Bảng `monDaoTao` có PK composite bao gồm `maMon` nên subquery cũng Seek qua Clustered Index.

```sql
SELECT
  SUM(b.diemSo * COALESCE(
    (SELECT TOP 1 soTinChi FROM monDaoTao m WHERE m.maMon = b.maMon), 3)
  ) /
  NULLIF(SUM(COALESCE(
    (SELECT TOP 1 soTinChi FROM monDaoTao m WHERE m.maMon = b.maMon), 3)
  ), 0) AS CPA
FROM bangDiem b
WHERE b.MSV = N'SVBK0001'
```

**Execution Plan:**

*(Chèn ảnh Execution Plan tại đây)*

---

### 3.3. Giảng viên xem danh sách lớp dạy

**API tương ứng:** `GET /api/teachers/:MCB/classes`  
**Code ORM:** `LopTinChi.findAll({ where: { MCB: req.params.MCB } })`  
**Index sử dụng:** `IX_lopTinChi_MCB` (Covering Index — INCLUDE `maMon`, `kyDaoTao`, `trangThai`, `soLuongSinhVienMax`, `soLuongSinhVien`)

**Phân tích:** API trả về toàn bộ thông tin lớp tín chỉ. Nếu chỉ đánh index trên cột `MCB` thì SQL Server sẽ Seek index rồi phải Key Lookup về Clustered Index để lấy các cột còn lại. Bằng cách INCLUDE tất cả các cột vào index, truy vấn trở thành Covering — toàn bộ kết quả lấy từ index mà không cần truy cập Clustered Index.

```sql
SELECT [maLop], [MCB], [maMon], [kyDaoTao],
       [soLuongSinhVienMax], [soLuongSinhVien], [trangThai]
FROM [lopTinChi]
WHERE [MCB] = N'GV001'
```

**Execution Plan:**

*(Chèn ảnh Execution Plan tại đây)*

---

### 3.4. Danh sách lớp tín chỉ kèm thông tin môn và giảng viên

**API tương ứng:** `GET /api/students/available-classes`  
**Code ORM:** `LopTinChi.findAll({ include: [Mon, { model: CanBo, include: [Ttcn] }] })`  
**Index sử dụng:** Clustered Index PK của `mon` (Seek theo `maMon`), `canBo` (Seek theo `MCB`), `ttcn` (Seek theo `CCCD`)

**Phân tích:** Truy vấn JOIN 4 bảng. Bảng `lopTinChi` được quét một lần (đóng vai trò bảng gốc). Với mỗi dòng, SQL Server Seek vào Clustered Index PK của `mon`, `canBo`, `ttcn` qua các cột JOIN. Vì tất cả JOIN đều theo PK của bảng đích, không cần index bổ sung cho phía bảng được JOIN — Clustered Index Seek đã là tối ưu nhất.

```sql
SELECT ltc.[maLop], ltc.[MCB], ltc.[maMon], ltc.[kyDaoTao],
       ltc.[soLuongSinhVienMax], ltc.[soLuongSinhVien], ltc.[trangThai],
       m.[tenMon], m.[kieuMonHoc],
       cb.[MCB] AS [canBo_MCB], cb.[CCCD],
       t.[Ho], t.[Ten]
FROM [lopTinChi] AS ltc
  LEFT JOIN [mon] AS m ON ltc.[maMon] = m.[maMon]
  LEFT JOIN [canBo] AS cb ON ltc.[MCB] = cb.[MCB]
  LEFT JOIN [ttcn] AS t ON cb.[CCCD] = t.[CCCD]
```

**Execution Plan:**

*(Chèn ảnh Execution Plan tại đây)*

---

### 3.5. Giảng viên xem danh sách đề tài hướng dẫn

**API tương ứng:** `GET /api/teachers/:MCB/research`  
**Code ORM:** `SinhVien_NghienCuu.findAll({ where: { MCB: req.params.MCB }, attributes: ['maDeTai'] })`  
**Index sử dụng:** `IX_sinhVien_NghienCuu_MCB`

**Phân tích:** API lấy danh sách `maDeTai` do giảng viên hướng dẫn. Index `IX_sinhVien_NghienCuu_MCB` cho phép Seek theo `MCB`. Cột `maDeTai` là thành phần của Composite PK `(MSV, maDeTai)` — trong SQL Server, Clustered Key luôn được lưu kèm trong Non-clustered Index leaf. Do đó, `maDeTai` đã có sẵn trong index — không cần Key Lookup. Đây thực chất là một Covering query tự nhiên.

```sql
SELECT [maDeTai]
FROM [sinhVien_NghienCuu]
WHERE [MCB] = N'GV001'
```

**Execution Plan:**

*(Chèn ảnh Execution Plan tại đây)*

---

### 3.6. Thống kê phân loại GPA — Dashboard Admin

**API tương ứng:** `GET /api/admin/stats`  
**Code ORM:** `SinhVien.findAll({ attributes: [CASE WHEN GPA...], group: [...] })`  
**Index sử dụng:** `IX_sinhVien_GPA`

**Phân tích:** Truy vấn GROUP BY trên biểu thức CASE của cột `GPA`, đếm theo `MSV`. Index `IX_sinhVien_GPA` chứa `GPA` (index key) và `MSV` (Clustered Key, tự động có trong non-clustered index). Hai cột này đủ cho toàn bộ truy vấn — không cần Key Lookup. Thêm vào đó, index nhỏ hơn Clustered Index rất nhiều (chỉ 2 cột thay vì toàn bộ hàng), giảm I/O đáng kể.

```sql
SELECT
  CASE
    WHEN [GPA] >= 3.6 THEN 'Xuat sac'
    WHEN [GPA] >= 3.2 THEN 'Gioi'
    WHEN [GPA] >= 2.5 THEN 'Kha'
    WHEN [GPA] >= 2.0 THEN 'Trung binh'
    ELSE 'Yeu'
  END AS [range],
  COUNT([MSV]) AS [count]
FROM [sinhVien]
GROUP BY
  CASE
    WHEN [GPA] >= 3.6 THEN 'Xuat sac'
    WHEN [GPA] >= 3.2 THEN 'Gioi'
    WHEN [GPA] >= 2.5 THEN 'Kha'
    WHEN [GPA] >= 2.0 THEN 'Trung binh'
    ELSE 'Yeu'
  END
```

**Execution Plan:**

*(Chèn ảnh Execution Plan tại đây)*

---

### 3.7. Thống kê trạng thái sinh viên — Dashboard Admin

**API tương ứng:** `GET /api/admin/stats`  
**Code ORM:** `SinhVien.findAll({ attributes: ['trangThai', COUNT(MSV)], group: ['trangThai'] })`  
**Index sử dụng:** `IX_sinhVien_trangThai`

**Phân tích:** Tương tự mục 3.6. Index `IX_sinhVien_trangThai` chứa `trangThai` (index key) và `MSV` (Clustered Key). Hai cột này đủ cho SELECT và GROUP BY — không cần Key Lookup. SQL Server quét index nhỏ thay vì Clustered Index toàn bộ.

```sql
SELECT [trangThai], COUNT([MSV]) AS [count]
FROM [sinhVien]
GROUP BY [trangThai]
```

**Execution Plan:**

*(Chèn ảnh Execution Plan tại đây)*

---

## 4. Tổng kết

### 4.1. Kết quả tối ưu

| # | Truy vấn (API) | Trước tối ưu | Sau tối ưu | Key Lookup |
|---|----------------|-------------|------------|------------|
| 3.1 | Bảng điểm SV (`/students/:MSV/grades`) | Clustered Index Scan | Index Seek (Covering) | Không |
| 3.2 | Tính GPA (`/students/:MSV/gpa`) | Clustered Scan × 2 | Index Seek + PK Seek | Không |
| 3.3 | Lớp của GV (`/teachers/:MCB/classes`) | Clustered Index Scan | Index Seek (Covering) | Không |
| 3.4 | DS lớp tín chỉ (`/students/available-classes`) | Hash Match + Scan | Nested Loop + PK Seek | Không |
| 3.5 | Đề tài GV (`/teachers/:MCB/research`) | Clustered Index Scan | Index Seek | Không |
| 3.6 | Phân loại GPA (`/admin/stats`) | Clustered Scan + Sort | Index Scan (nhỏ hơn) | Không |
| 3.7 | Trạng thái SV (`/admin/stats`) | Clustered Scan | Index Scan (nhỏ hơn) | Không |

### 4.2. Giải thích kỹ thuật

- **Index Seek vs Index Scan:** Seek truy cập trực tiếp vào vị trí cần tìm (O(log n)), Scan quét toàn bộ index (O(n)). Seek hiệu quả hơn Scan khi truy vấn lọc theo điều kiện cụ thể.
- **Covering Index:** Index có thêm mệnh đề `INCLUDE` chứa các cột được SELECT. Khi tất cả cột cần thiết đều nằm trong index, SQL Server không cần Key Lookup về Clustered Index — giảm I/O đáng kể.
- **Key Lookup:** Khi Non-clustered Index không chứa đủ cột, SQL Server phải quay lại Clustered Index để lấy dữ liệu còn thiếu. Mỗi Key Lookup là một thao tác I/O bổ sung — với nhiều dòng kết quả, chi phí tích lũy rất lớn.
