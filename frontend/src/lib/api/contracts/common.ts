export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

export interface IReadRepository<T, TKey = string> {
  findById(id: TKey): Promise<T | null>;
  list(params?: ListParams): Promise<Page<T>>;
}

export interface IWriteRepository<T, TKey = string, TInput = Partial<T>> {
  create(input: TInput): Promise<T>;
  update(id: TKey, input: TInput): Promise<T>;
  delete(id: TKey): Promise<void>;
}

export interface ICrudRepository<T, TKey = string, TInput = Partial<T>>
  extends IReadRepository<T, TKey>,
    IWriteRepository<T, TKey, TInput> {}
