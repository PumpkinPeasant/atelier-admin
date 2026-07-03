<script setup lang="ts">
import DataTable from '@/components/ui/table/DataTable.vue'
import DataTableHeader from '@/components/ui/table/DataTableHeader.vue'
import DataTablePagination from '@/components/ui/table/DataTablePagination.vue'
import { useDataTable } from '@/composables/useDataTable'
import {
  productsApi,
  type ProductCardTableRow,
} from '@/services/products'
import { useNotificationsStore } from '@/stores/notifications'
import type { TableHeader } from '@/interfaces/ui/table.interface'

const notifications = useNotificationsStore()

const headers: TableHeader<ProductCardTableRow>[] = [
  { key: 'id', title: 'ID', sortable: true },
  { key: 'titleLabel', title: 'Карточка', sortable: true },
  { key: 'productName', title: 'Товар', sortable: true },
  { key: 'slugLabel', title: 'Slug', sortable: true },
  { key: 'statusLabel', title: 'Статус', sortable: true },
  { key: 'priceLabel', title: 'Цена', sortable: true },
  { key: 'imagesCount', title: 'Фото', sortable: true },
  { key: 'variantsCount', title: 'Варианты', sortable: true },
  { key: 'publishedAtLabel', title: 'Опубликована', sortable: true },
]

const { items, totalCount, currentPage, pageSize, sortData, isLoading, loadItems, search } =
  useDataTable<ProductCardTableRow>(productsApi.listProductCards)

const notImplemented = () => notifications.info('Редактирование карточек появится позже')

const togglePublication = async (item: ProductCardTableRow) => {
  try {
    if (item.status === 'published') {
      await productsApi.unpublishProductCard(item.id)
      notifications.success('Карточка снята с публикации')
    } else {
      await productsApi.publishProductCard(item.id)
      notifications.success('Карточка опубликована')
    }
    await loadItems()
  } catch {
    notifications.error('Не удалось изменить статус карточки')
  }
}
</script>

<template>
  <section class="card">
    <DataTableHeader
      search-placeholder="Поиск по карточкам"
      create-btn-text="Добавить карточку"
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
      empty-state-title="Карточки не найдены"
      empty-state-description="Создайте карточки из раздела товаров или сбросьте поиск."
    >
      <template #slugLabel="{ item }">
        <span class="slug-cell">{{ item.slugLabel }}</span>
      </template>

      <template #statusLabel="{ item }">
        <span class="status" :class="`status--${item.status}`">
          {{ item.statusLabel }}
        </span>
      </template>

      <template #publishedAtLabel="{ item }">
        <span class="muted-cell">{{ item.publishedAtLabel }}</span>
      </template>

      <template #actions="{ item }">
        <button
          :title="item.status === 'published' ? 'Снять с публикации' : 'Опубликовать'"
          class="btn-secondary-icon"
          type="button"
          @click="togglePublication(item)"
        >
          <i v-lucide="item.status === 'published' ? 'eye-off' : 'eye'" />
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
.slug-cell {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: var(--fs-50);
  color: var(--clr-neutral-700);
}

.muted-cell {
  color: var(--clr-neutral-600);
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 3px var(--size-100);
  font-size: var(--fs-50);
  font-weight: var(--fw-bold);
  border-radius: var(--radius-sm);
}

.status--draft {
  color: var(--clr-neutral-700);
  background: var(--clr-neutral-300);
}

.status--published {
  color: var(--clr-success);
  background: color-mix(in srgb, var(--clr-success) 12%, transparent);
}
</style>
