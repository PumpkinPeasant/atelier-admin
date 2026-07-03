<script setup lang="ts">
import DataTable from '@/components/ui/table/DataTable.vue'
import DataTableHeader from '@/components/ui/table/DataTableHeader.vue'
import DataTablePagination from '@/components/ui/table/DataTablePagination.vue'
import { useDataTable } from '@/composables/useDataTable'
import { productsApi, type ProductTableRow } from '@/services/products'
import { useNotificationsStore } from '@/stores/notifications'
import type { TableHeader } from '@/interfaces/ui/table.interface'

const notifications = useNotificationsStore()

const headers: TableHeader<ProductTableRow>[] = [
  { key: 'id', title: 'ID', sortable: true },
  { key: 'name', title: 'Товар', sortable: true },
  { key: 'categoryLabel', title: 'Категория', sortable: true },
  { key: 'genderLabel', title: 'Пол', sortable: true },
  { key: 'fitLabel', title: 'Посадка', sortable: true },
  { key: 'density', title: 'Плотность', sortable: true },
  { key: 'priceLabel', title: 'Цена', sortable: true },
  { key: 'variantsCount', title: 'Варианты', sortable: true },
  { key: 'stockLabel', title: 'Остаток', sortable: true },
  { key: 'cardStatusLabel', title: 'Карточка', sortable: true },
]

const { items, totalCount, currentPage, pageSize, sortData, isLoading, loadItems, search } =
  useDataTable<ProductTableRow>(productsApi.listProducts)

const notImplemented = () => notifications.info('Редактирование товаров появится позже')

const createCard = async (item: ProductTableRow) => {
  try {
    await productsApi.createProductCard(item.id)
    notifications.success('Карточка товара создана')
    await loadItems()
  } catch {
    notifications.error('Не удалось создать карточку товара')
  }
}
</script>

<template>
  <section class="card">
    <DataTableHeader
      search-placeholder="Поиск по товарам"
      create-btn-text="Добавить товар"
      @on-search-input="search"
      @on-create-click="notImplemented"
    >
      <template #append>
        <button class="btn-regular" type="button" @click="loadItems">
          <i v-lucide="'refresh-cw'" />
          Обновить
        </button>
      </template>
    </DataTableHeader>

    <DataTable
      :is-loading="isLoading"
      v-model:sort-data="sortData"
      @update:sort="loadItems"
      :headers="headers"
      :items="items"
      empty-state-title="Товары не найдены"
      empty-state-description="Создайте товары на бэкенде или сбросьте поиск."
    >
      <template #density="{ item }"> {{ item.density }} г/м² </template>

      <template #compositionLabel="{ item }">
        <span class="muted-cell" :title="item.compositionLabel">
          {{ item.compositionLabel }}
        </span>
      </template>

      <template #cardStatusLabel="{ item }">
        <span class="status" :class="{ 'status--empty': !item.hasCard }">
          {{ item.cardStatusLabel }}
        </span>
      </template>

      <template #actions="{ item }">
        <button
          v-if="!item.hasCard"
          title="Создать карточку"
          class="btn-secondary-icon"
          type="button"
          @click="createCard(item)"
        >
          <i v-lucide="'panel-top'" />
        </button>
        <button title="Редактировать" class="btn-secondary-icon" type="button" @click="notImplemented">
          <i v-lucide="'edit-2'" />
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

<style scoped>
.muted-cell {
  display: inline-block;
  max-width: 280px;
  overflow: hidden;
  color: var(--clr-neutral-700);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 3px var(--size-100);
  font-size: var(--fs-50);
  font-weight: var(--fw-bold);
  color: var(--clr-neutral-800);
  background: var(--clr-neutral-300);
  border-radius: var(--radius-sm);
}

.status--empty {
  color: var(--clr-neutral-600);
  background: transparent;
  border: 1px solid var(--clr-neutral-400);
}
</style>
