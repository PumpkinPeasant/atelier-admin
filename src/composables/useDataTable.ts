import { onMounted, ref, type Ref } from 'vue'
import type { ListParams, ListResult } from '@/interfaces/api/request.interface'

export type DataTableFetcher<T> = (params: ListParams) => Promise<ListResult<T>>

type SortState = Pick<ListParams, 'sort_by' | 'sort_desc'>

interface UseDataTableOptions {
  pageSize?: number
  /** Задержка дебаунса поиска, мс. */
  searchDebounce?: number
  /** Автозагрузка при монтировании. */
  immediate?: boolean
}

/**
 * Инкапсулирует логику таблицы: пагинация, сортировка, поиск с дебаунсом,
 * состояние загрузки. Перенесено из notification-frontend (паттерн Users.vue)
 * в переиспользуемый composable.
 */
export function useDataTable<T>(
  fetcher: DataTableFetcher<T>,
  options: UseDataTableOptions = {},
) {
  const { pageSize: initialPageSize = 10, searchDebounce = 500, immediate = true } =
    options

  const items = ref([]) as Ref<T[]>
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(initialPageSize)
  const searchString = ref('')
  const sortData = ref<SortState>({ sort_by: null, sort_desc: null })
  const isLoading = ref(false)

  let loaderDebounce: ReturnType<typeof setTimeout>
  let searchDebounceId: ReturnType<typeof setTimeout>

  const loadItems = async () => {
    clearTimeout(loaderDebounce)
    loaderDebounce = setTimeout(() => {
      isLoading.value = true
    }, 400)

    try {
      const response = await fetcher({
        page: currentPage.value,
        page_size: pageSize.value,
        search: searchString.value,
        ...sortData.value,
      })
      items.value = response.items
      totalCount.value = response.total
    } finally {
      clearTimeout(loaderDebounce)
      isLoading.value = false
    }
  }

  const search = (value: string) => {
    clearTimeout(searchDebounceId)
    searchDebounceId = setTimeout(async () => {
      searchString.value = value
      currentPage.value = 1
      await loadItems()
    }, searchDebounce)
  }

  if (immediate) {
    onMounted(loadItems)
  }

  return {
    items,
    totalCount,
    currentPage,
    pageSize,
    searchString,
    sortData,
    isLoading,
    loadItems,
    search,
  }
}
