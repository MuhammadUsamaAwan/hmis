export interface PaginatedQueryParams {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  q?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pageCount: number;
}
