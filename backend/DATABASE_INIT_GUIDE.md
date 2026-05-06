# Tài liệu khởi tạo CSDL (Chuẩn hóa)

## 1. Mục đích
Tài liệu này mô tả cách khởi tạo cơ sở dữ liệu cho bài toán quản lý đào tạo bằng `sequelize-cli`.

**Thông số hiện tại:**
- `sequelize` `^6.37.8`
- `sequelize-cli` `^6.6.5`
- Database: `qldh` (MSSQL)
- Định dạng file: `.cjs` (CommonJS)

## 2. Danh sách script khởi tạo

| Loại | File | Vai trò |
| --- | --- | --- |
| Migration | `migrations/20260416090000-create-academic-schema.cjs` | Tạo 25 bảng và ràng buộc |
| Seed 1 | `seeders/20260416091000-seed-academic-schema.cjs` | Dữ liệu nền tối thiểu (36 bản ghi) |
| Seed 2 | `seeders/20260416103000-seed-more-academic-data.cjs` | Dữ liệu mở rộng cho demo & test |

## 3. Cách thực thi

```bash
# Thực hiện migrate tạo bảng
npx sequelize-cli db:migrate

# Thực hiện nạp toàn bộ dữ liệu mẫu
npx sequelize-cli db:seed:all

# Rollback (khi cần làm sạch)
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:migrate:undo:all
```

## 4. Migration: Những điểm lưu ý
- Toàn bộ thao tác chạy trong `transaction`.
- Khóa ngoại của `sinhVien.maKhoa` được thêm qua `addConstraint` sau khi tạo bảng để tránh lỗi phụ thuộc vòng giữa `canBo`, `Khoa` và `sinhVien`.
- Kiểu dữ liệu ID thống nhất là `STRING(50)`.

## 5. Seeders: Cấu trúc dữ liệu
### 5.1. Seed 1 (Dữ liệu gốc)
- Nạp thông tin cho 2 Sinh viên (`SV001`, `SV002`) và 2 Cán bộ.
- Thiết lập khung chương trình CNTT, hệ Chính quy, bậc Đại học.
- Nạp đầy đủ các bảng liên kết để demo tính năng Học bổng, NCKH, Đồ án, Du học và Sự kiện.

### 5.2. Seed 2 (Dữ liệu mở rộng)
- Bổ sung thêm 2 Sinh viên (`SV003`, `SV004`) và 1 Cán bộ mới.
- Thêm các môn chuyên ngành: Lập trình Web (`IT301`), Kiểm thử (`IT302`).
- Mô phỏng dữ liệu đăng ký lớp tín chỉ và kết quả học tập phong phú hơn.

## 6. Trạng thái sau khi khởi tạo
Hệ thống sẽ có tổng cộng **69 bản ghi mẫu**, đảm bảo đầy đủ các mối quan hệ nghiệp vụ để kiểm thử toàn diện các module của phần mềm.
