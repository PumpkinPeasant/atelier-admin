<script setup lang="ts">
import DataTable from '@/components/ui/table/DataTable.vue'
import DataTableHeader from '@/components/ui/table/DataTableHeader.vue'
import DataTablePagination from '@/components/ui/table/DataTablePagination.vue'
import { useDataTable } from '@/composables/useDataTable'
import { useNotificationsStore } from '@/stores/notifications'
import { referencesApi, type Color } from '@/services/references.mock'
import type { TableHeader } from '@/interfaces/ui/table.interface'

const notifications = useNotificationsStore()

const headers: TableHeader<Color>[] = [
  { key: 'id', title: 'ID', sortable: true },
  { key: 'name', title: 'Название', sortable: true },
  { key: 'hex', title: 'Код', sortable: true },
]

const { items, totalCount, currentPage, pageSize, sortData, isLoading, loadItems, search } =
  useDataTable<Color>(referencesApi.listColors)

const notImplemented = () => notifications.info('Редактирование справочников появится позже')
</script>

<template>
  <section class="card">
    <DataTableHeader
      search-placeholder="Поиск по цветам"
      create-btn-text="Добавить цвет"
      @on-search-input="search"
      @on-create-click="notImplemented"
    />

    <DataTable
      :is-loading="isLoading"
      v-model:sort-data="sortData"
      @update:sort="loadItems"
      :headers="headers"
      :items="items"
      empty-state-title="Цвета не найдены"
    >
      <template #hex="{ item }">
        <span class="color-cell">
          <span class="color-swatch" :style="{ backgroundColor: item.hex }" />
          {{ item.hex }}
        </span>
      </template>

      <template #actions="{ item }">
        <button title="Редактировать" class="btn-secondary-icon" @click="notImplemented">
          <i v-lucide="'edit-2'" />
        </button>
        <button title="Удалить" class="btn-secondary-icon" @click="() => notImplemented()">
          <i v-lucide="'trash-2'" />
        </button>
        <span class="sr-only">{{ item.id }}</span>
      </template>
    </DataTable>

    <DataTablePagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total-count="totalCount"
      @update:page="loadItems"
    />
  </section>
</template>

<style scoped>
.color-cell {
  display: inline-flex;
  gap: var(--size-200);
  align-items: center;
}

.color-swatch {
  width: 18px;
  height: 18px;
  border: 1px solid var(--clr-neutral-400);
  border-radius: var(--radius-sm);
}

.sr-only {
  display: none;
}
</style>
