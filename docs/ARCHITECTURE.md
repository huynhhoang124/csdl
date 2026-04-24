# QLDH — Kiến trúc

## Triết lý thiết kế

**Pluggable Backend**: frontend phải độc lập hoàn toàn với implement backend. Đổi backend (REST → Supabase → GraphQL → Firebase...) chỉ cần đổi 1 biến môi trường, không chạm tới component/page.

## Monorepo layout

```
qldh/
├── packages/shared/             SSOT — Zod schemas + types dùng chung FE/BE
├── backend/                     Express + Sequelize + MSSQL (REST API)
├── frontend/                    React + Vite + Tailwind + shadcn
└── docker-compose.yml           MSSQL service
```

## Lớp trừu tượng phía frontend

```
frontend/src/lib/api/
├── contracts/         Interface (IAuthRepository, IStudentRepository, ...)
├── adapters/
│   ├── mock/          In-memory (faker) — chạy offline không cần BE
│   ├── rest/          Gọi Express backend qua axios
│   ├── graphql/       (tương lai)
│   └── supabase/      (tương lai)
├── factory.ts         Chọn adapter theo VITE_BACKEND_MODE
└── index.ts           export `repositories` bundle
```

## Luồng dữ liệu

```
UI component
   ↓ (dùng hooks)
useStudent / useGrade / ...
   ↓ (gọi repository)
repositories.student.findById(msv)
   ↓ (interface)
IStudentRepository
   ↓ (implementation chọn bởi factory)
┌────────────┬────────────┬────────────┐
MockAdapter  RestAdapter  SupabaseAdapter
(faker)      (axios)      (supabase-js)
```

## Quy tắc vàng
- ❌ Cấm `axios`/`fetch` trực tiếp trong component
- ✅ Mọi IO đi qua `repositories.*`
- ✅ Mọi DTO là Zod schema trong `@qldh/shared`
- ✅ TanStack Query wrap repository calls
- ✅ Mỗi adapter phải pass cùng bộ **contract test**

## Thêm backend mới (VD Supabase)

```ts
// frontend/src/lib/api/adapters/supabase/SupabaseStudentRepository.ts
import { createClient } from '@supabase/supabase-js';
import type { IStudentRepository } from '../../contracts';

export class SupabaseStudentRepository implements IStudentRepository {
  // implement các method của IStudentRepository
}
```

```ts
// frontend/src/lib/api/factory.ts
import * as supabase from './adapters/supabase';

case 'supabase':
  return { auth: new supabase.SupabaseAuthRepository(), /* ... */ };
```

```bash
# .env
VITE_BACKEND_MODE=supabase
```

**Xong.** Không component/page nào phải sửa.

## Runtime Backend Switcher

Dev Console có dropdown đổi backend runtime:
- Lưu `qldh:backend-mode` vào `localStorage`
- `getBackendMode()` ưu tiên localStorage > env
- `setBackendMode(mode)` lưu + `window.location.reload()`

Hữu ích để demo tính pluggable tại chỗ.

## Contract Test

```ts
describe.each([
  ['mock', new MockStudentRepository()],
  ['rest', new RestStudentRepository()],
  // ['supabase', new SupabaseStudentRepository()],
])('IStudentRepository: %s', (_, repo) => {
  it('findById trả về SinhVien đúng shape', async () => {
    const sv = await repo.findById('SV001');
    if (sv) expect(SinhVienSchema.safeParse(sv).success).toBe(true);
  });
});
```

Đảm bảo mọi adapter mới tuân thủ contract → an toàn khi thay thế.
