import type { ListParams, ListResult } from '@/interfaces/api/request.interface'

/**
 * Временный in-memory источник данных для справочников.
 * Повторяет серверный контракт (page/page_size/sort/search) — при подключении
 * бэка atelier-back заменяется на реальные вызовы через http-сервис без правок
 * во вью и composable.
 */

export interface Color {
  id: number
  name: string
  hex: string
}

export interface Material {
  id: number
  name: string
  composition: string
}

export interface Size {
  id: number
  label: string
  sort_order: number
}

export interface CategoryGroup {
  id: number
  name: string
  slug: string
}

export interface Category {
  id: number
  name: string
  group: string
  slug: string
}

const colors: Color[] = [
  { id: 1, name: 'Чёрный', hex: '#1d1b17' },
  { id: 2, name: 'Молочный', hex: '#f5f2ed' },
  { id: 3, name: 'Тауп', hex: '#948778' },
  { id: 4, name: 'Олива', hex: '#3e4740' },
  { id: 5, name: 'Терракота', hex: '#b4472e' },
  { id: 6, name: 'Песочный', hex: '#c6b7a9' },
  { id: 7, name: 'Графит', hex: '#3a342c' },
  { id: 8, name: 'Бежевый', hex: '#e4dcd6' },
]

const materials: Material[] = [
  { id: 1, name: 'Хлопок', composition: '100% хлопок' },
  { id: 2, name: 'Лён', composition: '100% лён' },
  { id: 3, name: 'Шерсть', composition: '80% шерсть, 20% полиамид' },
  { id: 4, name: 'Кашемир', composition: '100% кашемир' },
  { id: 5, name: 'Вискоза', composition: '100% вискоза' },
  { id: 6, name: 'Деним', composition: '98% хлопок, 2% эластан' },
]

const sizes: Size[] = [
  { id: 1, label: 'XS', sort_order: 1 },
  { id: 2, label: 'S', sort_order: 2 },
  { id: 3, label: 'M', sort_order: 3 },
  { id: 4, label: 'L', sort_order: 4 },
  { id: 5, label: 'XL', sort_order: 5 },
  { id: 6, label: 'XXL', sort_order: 6 },
]

const categoryGroups: CategoryGroup[] = [
  { id: 1, name: 'Одежда', slug: 'clothing' },
  { id: 2, name: 'Аксессуары', slug: 'accessories' },
  { id: 3, name: 'Обувь', slug: 'shoes' },
]

const categories: Category[] = [
  { id: 1, name: 'Футболки', group: 'Одежда', slug: 'tshirts' },
  { id: 2, name: 'Свитшоты', group: 'Одежда', slug: 'sweatshirts' },
  { id: 3, name: 'Брюки', group: 'Одежда', slug: 'pants' },
  { id: 4, name: 'Шорты', group: 'Одежда', slug: 'shorts' },
  { id: 5, name: 'Сумки', group: 'Аксессуары', slug: 'bags' },
  { id: 6, name: 'Ремни', group: 'Аксессуары', slug: 'belts' },
  { id: 7, name: 'Кроссовки', group: 'Обувь', slug: 'sneakers' },
]

function paginate<T extends object>(
  source: T[],
  params: ListParams,
  searchKeys: (keyof T)[],
): Promise<ListResult<T>> {
  let rows = [...source]

  const query = params.search?.trim().toLowerCase()
  if (query) {
    rows = rows.filter((row) =>
      searchKeys.some((key) => String(row[key]).toLowerCase().includes(query)),
    )
  }

  if (params.sort_by) {
    const key = params.sort_by as keyof T
    const dir = params.sort_desc ? -1 : 1
    rows.sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv), 'ru') * dir
    })
  }

  const total = rows.length
  const start = (params.page - 1) * params.page_size
  const items = rows.slice(start, start + params.page_size)

  // Имитация сетевой задержки.
  return new Promise((resolve) => setTimeout(() => resolve({ items, total }), 250))
}

export const referencesApi = {
  listColors: (params: ListParams) => paginate(colors, params, ['name', 'hex']),
  listMaterials: (params: ListParams) =>
    paginate(materials, params, ['name', 'composition']),
  listSizes: (params: ListParams) => paginate(sizes, params, ['label']),
  listCategoryGroups: (params: ListParams) =>
    paginate(categoryGroups, params, ['name', 'slug']),
  listCategories: (params: ListParams) =>
    paginate(categories, params, ['name', 'group', 'slug']),
}
