<script setup lang="ts">
import { computed } from 'vue'

type VisiblePageItem =
  | { key: string; type: 'page'; value: number }
  | { key: string; type: 'dots'; value?: never }

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()

const currentPage = defineModel<number>('currentPage', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

const props = withDefaults(
  defineProps<{
    totalCount: number
    pageSizeOptions?: number[]
  }>(),
  {
    pageSizeOptions: () => [5, 10, 25, 50],
  },
)

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.totalCount / pageSize.value))
})

const visiblePages = computed<VisiblePageItem[]>(() => {
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => ({
      key: `page-${i + 1}`,
      type: 'page',
      value: i + 1,
    }))
  }

  const pages: VisiblePageItem[] = []
  pages.push({ key: 'page-1', type: 'page', value: 1 })

  if (current > 3) {
    pages.push({ key: 'dots-left', type: 'dots' })
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let page = start; page <= end; page++) {
    pages.push({ key: `page-${page}`, type: 'page', value: page })
  }

  if (current < total - 2) {
    pages.push({ key: 'dots-right', type: 'dots' })
  }

  pages.push({ key: `page-${total}`, type: 'page', value: total })

  return pages
})

const updatePageSize = () => {
  currentPage.value = 1
  emit('update:page', 1)
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return

  currentPage.value = page
  emit('update:page', page)
}
</script>

<template>
  <div class="pagination">
    <div class="pagination-info">
      Показано элементов:
      <div class="pagination-select">
        <select
          @change="updatePageSize"
          v-model="pageSize"
          name="select"
          class="pagination-select__input"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>

        <i v-lucide="'chevron-down'" class="pagination-select__icon" />
      </div>

      из {{ totalCount }}
    </div>

    <div class="pagination-controls">
      <button
        title="Назад"
        class="btn-regular pagination-btn"
        :class="{ 'btn-regular--disabled': currentPage === 1 }"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <i v-lucide="'arrow-left'" />
      </button>

      <template v-for="page in visiblePages" :key="page.key">
        <span v-if="page.type === 'dots'" class="pagination-dots">...</span>

        <button
          :title="`Страница ${page.value}`"
          v-else
          class="btn-regular pagination-btn"
          :class="{ 'pagination-btn--active': currentPage === page.value }"
          @click="goToPage(page.value!)"
        >
          {{ page.value }}
        </button>
      </template>

      <button
        title="Вперед"
        class="btn-regular pagination-btn"
        :class="{ 'btn-regular--disabled': currentPage === totalPages }"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <i v-lucide="'arrow-right'" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  gap: var(--size-300);
  align-items: center;
  justify-content: space-between;
  padding-top: var(--size-300);
  margin-top: var(--size-300);
}

.pagination-info {
  font-size: var(--fs-100);
  color: var(--clr-neutral-600);
}

.pagination-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin: 0 var(--size-100);
}

.pagination-select__input {
  padding: 6px 28px 6px 10px;
  font-size: var(--fs-100);
  color: var(--clr-neutral-800);
  appearance: none;
  cursor: pointer;
  outline: none;
  background: var(--clr-neutral-200);
  border: 1px solid var(--clr-neutral-400);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.pagination-select__input:hover {
  background: var(--clr-neutral-100);
  border-color: var(--clr-neutral-500);
}

.pagination-select__input:focus {
  border-color: var(--clr-accent-500);
  box-shadow: 0 0 0 3px var(--clr-accent-soft);
}

.pagination-select__icon {
  position: absolute;
  right: 8px;
  font-size: 16px;
  color: var(--clr-neutral-500);
  pointer-events: none;
  transition: transform 0.2s ease;
}

.pagination-select:focus-within .pagination-select__icon {
  transform: rotate(-180deg);
}

.pagination-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-200);
  align-items: center;
  justify-content: flex-end;
}

.pagination-btn {
  width: 2.625rem;
  height: 2.625rem;
  padding: var(--size-100);
}

.pagination-btn--active {
  color: var(--color-text-inverse);
  background-color: var(--clr-accent-500);
  border-color: var(--clr-accent-500);
}

.pagination-btn--active:hover {
  background-color: var(--clr-accent-600) !important;
}

.pagination-dots {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  color: var(--clr-neutral-500);
}

@media screen and (max-width: 768px) {
  .pagination {
    flex-direction: column;
    align-items: center;
  }

  .pagination-controls {
    gap: var(--size-100);
    justify-content: center;
    width: 100%;
  }

  .pagination-btn {
    width: 2.25rem;
    height: 2.25rem;
  }
}
</style>
