export interface TableHeader<T> {
  key: keyof T
  title: string
  sortable?: boolean
}
