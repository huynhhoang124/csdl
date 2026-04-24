import type { TableName } from '@qldh/shared';
import type { Page, ListParams } from './common';

/** Dùng cho Dev Console — CRUD generic mọi bảng */
export interface IGenericRepository {
  list(table: TableName, params?: ListParams): Promise<Page<Record<string, unknown>>>;
  get(table: TableName, pk: Record<string, unknown>): Promise<Record<string, unknown> | null>;
  create(table: TableName, data: Record<string, unknown>): Promise<Record<string, unknown>>;
  update(
    table: TableName,
    pk: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>>;
  delete(table: TableName, pk: Record<string, unknown>): Promise<void>;
  resetAndReseed(): Promise<{ ok: true; durationMs: number }>;
}
