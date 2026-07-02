export interface ListParams {
  page: number
  page_size: number
  sort_by?: string | null
  sort_desc?: boolean | null
  search?: string | null
}

export interface ListResult<T> {
  items: T[]
  total: number
}
