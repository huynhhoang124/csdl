# QLDH — Hệ thống Quản lý Đào tạo

Full-stack web app với **pluggable backend architecture** — frontend độc lập hoàn toàn với backend thật (REST / Mock / GraphQL / Supabase...).

## Kiến trúc

```
qldh/
├── packages/shared/     # Zod schemas + types dùng chung (SSOT)
├── backend/             # Express + Sequelize + MSSQL
├── frontend/            # React + Vite + TS + Tailwind + shadcn/ui
└── docker-compose.yml   # MSSQL service
```

## Yêu cầu
- Node.js ≥ 18.17
- npm ≥ 9 (workspaces)
- Docker (tuỳ chọn, để chạy MSSQL nhanh)

## Cài đặt
```bash
npm install
```

## Chạy

### Chế độ offline (mock, không cần DB)
```bash
# frontend/.env.local
VITE_BACKEND_MODE=mock
npm run dev:frontend
```

### Chế độ full-stack
```bash
docker compose up -d mssql
npm run db:migrate
npm run db:seed
npm run dev
```

## Tài khoản demo
| Role | Username | Password |
|---|---|---|
| Dev | `dev@qldh.local` | `dev123` |
| Student | `SV001` | `student123` |
| Teacher | `CB001` | `teacher123` |

## Roadmap Sprint
- [x] Sprint 1 — Foundation
- [ ] Sprint 2 — Mock adapter + UI skeleton
- [ ] Sprint 3 — REST adapter + backend thật
- [ ] Sprint 4 — Dev Console
- [ ] Sprint 5 — Student & Teacher Portal
- [ ] Sprint 6 — Polish & Test

Chi tiết: `docs/ARCHITECTURE.md`.
