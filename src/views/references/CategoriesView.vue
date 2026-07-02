<script setup lang="ts">
import DataTable from '@/components/ui/table/DataTable.vue'
import DataTableHeader from '@/components/ui/table/DataTableHeader.vue'
import DataTablePagination from '@/components/ui/table/DataTablePagination.vue'
import { useDataTable } from '@/composables/useDataTable'
import { useNotificationsStore } from '@/stores/notifications'
import { referencesApi, type Category } from '@/services/references.mock'
import type { TableHeader } from '@/interfaces/ui/table.interface'

const notifications = useNotificationsStore()

const headers: TableHeader<Category>[] = [
  { key: 'id', title: 'ID', sortable: true },
  { key: 'name', title: 'Название', sortable: true },
  { key: 'group', title: 'Группа', sortable: true },
  { key: 'slug', title: 'Слаг', sortable: true },
]

const { items, totalCount, currentPage, pageSize, sortData, isLoading, loadItems, search } =
  useDataTable<Category>(referencesApi.listCategories)

const notImplemented = () => notifications.info('Редактирование справочников появится позже')
</script>

<template>
  <section class="card">
    <DataTableHeader
      search-placeholder="Поиск по категориям"
      create-btn-text="Добавить категорию"
      @on-search-input="search"
      @on-create-click="notImplemented"
    />

    <DataTable
      :is-loading="isLoading"
      v-model:sort-data="sortData"
      @update:sort="loadItems"
      :headers="headers"
      :items="items"
      empty-state-title="Категории не найдены"
    >
      <template #actions>
        <button title="Редактировать" class="btn-secondary-icon" @click="notImplemented">
          <i v-lucide="'edit-2'" />
        </button>
        <button title="Удалить" class="btn-secondary-icon" @click="notImplemented">
          <i v-lucide="'trash-2'" />
        </button>
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
