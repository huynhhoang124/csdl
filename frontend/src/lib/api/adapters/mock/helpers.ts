import type { ListParams, Page } from '../../contracts';

export function paginate<T>(items: T[], params?: ListParams): Page<T> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  let filtered = items;

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = items.filter((it) =>
      Object.values(it as Record<string, unknown>).some((v) => String(v ?? '').toLowerCase().includes(q))
    );
  }
  if (params?.sortBy) {
    const dir = params.sortDir === 'desc' ? -1 : 1;
    filtered = [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[params.sortBy!];
      const bv = (b as Record<string, unknown>)[params.sortBy!];
      if (av == null) return 1;
      if (bv == null) return -1;
      return av > bv ? dir : av < bv ? -dir : 0;
    });
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  return { items: filtered.slice(start, start + pageSize), total, page, pageSize };
}

export function matchFilters<T>(items: T[], filters?: Record<string, unknown>): T[] {
  if (!filters) return items;
  return items.filter((it) =>
    Object.entries(filters).every(([k, v]) => (it as Record<string, unknown>)[k] === v)
  );
}

/** Giả lập độ trễ mạng để UI hiển thị loading */
export const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));
