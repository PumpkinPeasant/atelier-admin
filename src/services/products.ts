import http from '@/services/http'
import type { ListParams, ListResult } from '@/interfaces/api/request.interface'

export type ProductCategory = 'tshirt' | 'shorts' | 'sweatshirt'
export type ProductGender = 'male' | 'female' | 'unisex'
export type ProductFit = 'slim' | 'regular' | 'oversize'
export type ProductCardStatus = 'draft' | 'published'

export interface ProductMaterial {
  material_id: number
  percent: number
  material: {
    id: number
    name: string
    composition?: string
  }
}

export interface ProductVariant {
  id: number
  color_id: number
  size_id: number
  sku: string | null
  stock: number | null
  price: string | number | null
  color: {
    id: number
    name: string
    hex: string
  }
  size: {
    id: number
    label: string
    sort_order: number
  }
}

export interface ProductCardBrief {
  id: number
  slug: string | null
  title: string | null
  status: ProductCardStatus
  published_at: string | null
}

export interface Product {
  id: number
  name: string
  category: ProductCategory
  gender: ProductGender
  fit: ProductFit
  density: number
  price: string | number
  composition: ProductMaterial[]
  variants: ProductVariant[]
  card: ProductCardBrief | null
}

export interface ProductImage {
  id: number
  url: string
  color_id: number | null
  sort_order: number
  is_main: boolean
}

export interface ProductCard {
  id: number
  product_id: number
  slug: string | null
  title: string | null
  description: string | null
  price: string | number | null
  status: ProductCardStatus
  published_at: string | null
  images: ProductImage[]
  product: Product
}

export interface ProductTableRow {
  id: number
  name: string
  categoryLabel: string
  genderLabel: string
  fitLabel: string
  density: number
  priceLabel: string
  compositionLabel: string
  variantsCount: number
  stockLabel: string
  cardStatusLabel: string
  hasCard: boolean
}

export interface ProductCardTableRow {
  id: number
  productName: string
  titleLabel: string
  slugLabel: string
  status: ProductCardStatus
  statusLabel: string
  priceLabel: string
  imagesCount: number
  variantsCount: number
  publishedAtLabel: string
}

const categoryLabels: Record<ProductCategory, string> = {
  tshirt: 'Футболка',
  shorts: 'Шорты',
  sweatshirt: 'Свитшот',
}

const genderLabels: Record<ProductGender, string> = {
  male: 'Мужской',
  female: 'Женский',
  unisex: 'Унисекс',
}

const fitLabels: Record<ProductFit, string> = {
  slim: 'Slim',
  regular: 'Regular',
  oversize: 'Oversize',
}

export const cardStatusLabels: Record<ProductCardStatus, string> = {
  draft: 'Черновик',
  published: 'Опубликована',
}

function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return String(value)

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(numeric)
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function sortRows<T extends object>(rows: T[], params: ListParams): T[] {
  if (!params.sort_by) return rows

  const key = params.sort_by as keyof T
  const dir = params.sort_desc ? -1 : 1

  return [...rows].sort((a, b) => {
    const av = a[key]
    const bv = b[key]

    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
    return String(av ?? '').localeCompare(String(bv ?? ''), 'ru') * dir
  })
}

function paginateRows<T extends object>(
  rows: T[],
  params: ListParams,
  searchKeys: (keyof T)[],
): ListResult<T> {
  const query = params.search?.trim().toLowerCase()
  let result = rows

  if (query) {
    result = rows.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(query)),
    )
  }

  result = sortRows(result, params)

  const total = result.length
  const start = (params.page - 1) * params.page_size

  return {
    items: result.slice(start, start + params.page_size),
    total,
  }
}

function toProductRow(product: Product): ProductTableRow {
  const totalStock = product.variants.reduce((sum, variant) => sum + (variant.stock ?? 0), 0)
  const hasTrackedStock = product.variants.some((variant) => variant.stock !== null)

  return {
    id: product.id,
    name: product.name,
    categoryLabel: categoryLabels[product.category] ?? product.category,
    genderLabel: genderLabels[product.gender] ?? product.gender,
    fitLabel: fitLabels[product.fit] ?? product.fit,
    density: product.density,
    priceLabel: formatCurrency(product.price),
    compositionLabel:
      product.composition
        .map((item) => `${item.material.name} ${item.percent}%`)
        .join(', ') || '—',
    variantsCount: product.variants.length,
    stockLabel: hasTrackedStock ? String(totalStock) : 'Не отслеживается',
    cardStatusLabel: product.card ? cardStatusLabels[product.card.status] : 'Нет карточки',
    hasCard: Boolean(product.card),
  }
}

function toProductCardRow(card: ProductCard): ProductCardTableRow {
  return {
    id: card.id,
    productName: card.product.name,
    titleLabel: card.title || card.product.name,
    slugLabel: card.slug || '—',
    status: card.status,
    statusLabel: cardStatusLabels[card.status],
    priceLabel: formatCurrency(card.price ?? card.product.price),
    imagesCount: card.images.length,
    variantsCount: card.product.variants.length,
    publishedAtLabel: formatDate(card.published_at),
  }
}

async function fetchProducts(): Promise<Product[]> {
  const { data } = await http.get<Product[]>('/admin/products', {
    params: { skip: 0, limit: 1000 },
  })
  return data
}

async function fetchProductCards(): Promise<ProductCard[]> {
  const { data } = await http.get<ProductCard[]>('/admin/product-cards', {
    params: { skip: 0, limit: 1000 },
  })
  return data
}

export const productsApi = {
  async listProducts(params: ListParams): Promise<ListResult<ProductTableRow>> {
    const rows = (await fetchProducts()).map(toProductRow)
    return paginateRows(rows, params, [
      'name',
      'categoryLabel',
      'genderLabel',
      'fitLabel',
      'compositionLabel',
      'cardStatusLabel',
    ])
  },

  async listProductCards(params: ListParams): Promise<ListResult<ProductCardTableRow>> {
    const rows = (await fetchProductCards()).map(toProductCardRow)
    return paginateRows(rows, params, [
      'productName',
      'titleLabel',
      'slugLabel',
      'statusLabel',
      'priceLabel',
    ])
  },

  async createProductCard(productId: number): Promise<ProductCard> {
    const { data } = await http.post<ProductCard>('/admin/product-cards', {
      product_id: productId,
    })
    return data
  },

  async publishProductCard(cardId: number): Promise<ProductCard> {
    const { data } = await http.post<ProductCard>(`/admin/product-cards/${cardId}/publish`)
    return data
  },

  async unpublishProductCard(cardId: number): Promise<ProductCard> {
    const { data } = await http.post<ProductCard>(
      `/admin/product-cards/${cardId}/unpublish`,
    )
    return data
  },
}
