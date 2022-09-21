export interface PaginateQuery {
  page?: number;
  limit?: number;
  search?: string;
  searchBy?: string[];
  filter?: {
    [column: string]: string | string[];
  };
  sortBy?: [string, string][];
}
