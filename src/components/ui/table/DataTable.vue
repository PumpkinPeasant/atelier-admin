<script setup lang="ts" generic="T extends object">
import { computed, useSlots } from 'vue'
import type { TableHeader } from '@/interfaces/ui/table.interface'
import type { ListParams } from '@/interfaces/api/request.interface'
import DataTableSortControls from '@/components/ui/table/DataTableSortControls.vue'
import DataTableLoadingState from '@/components/ui/table/DataTableLoadingState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

type SortState = Pick<ListParams, 'sort_by' | 'sort_desc'>

const props = defineProps<{
  headers: TableHeader<T>[]
  items: T[]
  emptyStateTitle?: string
  emptyStateDescription?: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:sort', value: SortState): void
}>()

const slots = useSlots()

const sortData = defineModel<SortState>('sortData', { required: true })

const getColumnSortValue = (key: keyof T) => {
  return sortData.value.sort_by === String(key) ? sortData.value.sort_desc : null
}

const sort = (key: keyof T, sortDesc: boolean | null) => {
  if (sortDesc === null) {
    sortData.value = { sort_by: null, sort_desc: null }
  } else {
    sortData.value = { sort_by: String(key), sort_desc: sortDesc }
  }

  emit('update:sort', sortData.value)
}

const tableHeaders = computed(() => props.headers)
const hasActionsSlot = computed(() => Boolean(slots.actions))
const tableColumnCount = computed(
  () => tableHeaders.value.length + (hasActionsSlot.value ? 1 : 0),
)
</script>

<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr class="table__row table__row--head">
          <th
            v-for="header in tableHeaders"
            :key="String(header.key)"
            class="table__cell table__cell--head"
          >
            <div class="table__cell--head-wrapper">
              <span>{{ header.title }}</span>

              <DataTableSortControls
                v-if="header.sortable"
                :model-value="getColumnSortValue(header.key)"
                @update:model-value="sort(header.key, $event)"
              />
            </div>
          </th>

          <th
            v-if="hasActionsSlot"
            class="table__cell table__cell--head table__cell--actions-head"
          >
            <div class="table__cell--head-wrapper">
              <span>Действия</span>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="isLoading">
          <td :colspan="tableColumnCount" class="table__loading">
            <slot name="loading-state">
              <DataTableLoadingState />
            </slot>
          </td>
        </tr>

        <tr v-else-if="!items.length">
          <td :colspan="tableColumnCount" class="table__empty">
            <slot name="empty-state">
              <EmptyState :title="emptyStateTitle" :description="emptyStateDescription" />
            </slot>
          </td>
        </tr>

        <tr
          v-else
          v-for="(item, index) in items"
          :key="index"
          class="table__row table__row--body"
        >
          <td v-for="header in headers" :key="String(header.key)" class="table__cell">
            <slot :name="String(header.key)" :item="item">
              {{ item[header.key] }}
            </slot>
          </td>

          <td v-if="hasActionsSlot" class="table__cell table__cell--actions">
            <div class="table__actions">
              <slot name="actions" :item="item" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  max-height: min(65vh, 720px);
  overflow: auto;
  background: var(--clr-neutral-100);
  border: 1px solid var(--clr-neutral-400);
  border-radius: var(--radius-md);
}

.table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
}

.table__row--head {
  background: var(--clr-neutral-300);
}

.table__row--body {
  transition: background-color 0.2s ease;
}

.table__row--body:nth-child(even) {
  background-color: var(--clr-neutral-200);
}

.table__row--body:hover {
  background-color: var(--clr-neutral-300);
}

.table__cell {
  padding: var(--size-300);
  font-size: var(--fs-100);
  vertical-align: middle;
  color: var(--clr-neutral-700);
  text-align: left;
  border-bottom: 1px solid var(--clr-neutral-400);
}

.table__cell--head {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--clr-neutral-300);
}

.table__cell--head-wrapper {
  display: flex;
  gap: var(--size-100);
  align-items: center;
  font-size: var(--fs-100);
  font-weight: var(--fw-bold);
  color: var(--clr-neutral-800);
  white-space: nowrap;
}

.table__cell--actions-head,
.table__cell--actions {
  width: 1%;
  white-space: nowrap;
}

.table__actions {
  display: flex;
  gap: var(--size-200);
  align-items: center;
}

.table tbody .table__row:last-child .table__cell {
  border-bottom: none;
}

.table__empty,
.table__loading {
  padding: 0;
  border-bottom: none;
}

@media (max-width: 768px) {
  .table-wrapper {
    max-height: min(55vh, 560px);
  }

  .table {
    min-width: 720px;
  }
}
</style>
