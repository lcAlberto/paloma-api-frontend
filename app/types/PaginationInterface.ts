export interface Pagination {
  current_page: number;
  per_page: number;
  total_count: number;
  next: number | null | undefined;
  previous: number | null | undefined;
  total_pages: number;
}