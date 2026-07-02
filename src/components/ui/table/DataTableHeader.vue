<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'onSearchInput', value: string): void
  (e: 'onCreateClick'): void
}>()

withDefaults(
  defineProps<{
    searchPlaceholder?: string
    createBtnText?: string
    createBtnIcon?: string
  }>(),
  {
    searchPlaceholder: 'Поиск',
    createBtnText: 'Создать',
    createBtnIcon: 'plus',
  },
)

const search = ref('')

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  search.value = value
  emit('onSearchInput', value)
}

const clear = () => {
  if (!search.value) return
  search.value = ''
  emit('onSearchInput', '')
}
</script>

<template>
  <div class="table-header">
    <div class="table-header--search">
      <span class="table-header--search-icon"><i v-lucide="'search'" /></span>
      <input
        :value="search"
        @input="onInput"
        :placeholder="searchPlaceholder"
        name="search"
        type="text"
      />
      <button v-if="search" class="table-header--clear" type="button" @click="clear">
        <i v-lucide="'x'" />
      </button>
    </div>

    <div class="table-header--append">
      <slot name="append">
        <button class="btn-primary" @click="emit('onCreateClick')">
          <i v-lucide="createBtnIcon" />
          {{ createBtnText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.table-header {
  display: flex;
  gap: var(--size-200);
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--size-400);
}

.table-header--search {
  display: flex;
  align-items: center;
  gap: var(--size-100);
  width: fit-content;
  min-width: 260px;
  padding: 0 var(--size-200);
  color: var(--clr-neutral-800);
  background-color: var(--clr-neutral-200);
  border: 1px solid var(--clr-neutral-400);
  border-radius: var(--btn-border-radius);
  outline: 3px solid transparent;
  transition:
    border-color 0.2s ease,
    outline-color 0.2s ease,
    background-color 0.2s ease;
}

.table-header--search:hover {
  border-color: var(--clr-neutral-500);
}

.table-header--search:focus-within {
  background-color: var(--clr-neutral-100);
  border-color: var(--clr-accent-500);
  outline-color: var(--clr-accent-soft);
}

.table-header--search-icon {
  display: inline-flex;
  font-size: var(--fs-200);
  color: var(--clr-neutral-600);
}

.table-header--search input {
  flex: 1;
  padding: var(--size-200) 0;
  font-size: var(--fs-100);
  color: inherit;
  background: none;
  border: none;
  outline: none;
}

.table-header--search input::placeholder {
  color: var(--clr-neutral-600);
}

.table-header--clear {
  display: inline-flex;
  padding: 4px;
  color: var(--clr-neutral-600);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  transition: color 0.2s ease;
}

.table-header--clear:hover {
  color: var(--clr-neutral-800);
}

.table-header--append {
  display: flex;
  gap: var(--size-200);
  align-items: center;
}

@media screen and (max-width: 600px) {
  .table-header {
    flex-direction: column-reverse;
    justify-content: end;
  }

  .table-header > * {
    width: 100%;
  }

  .table-header--search {
    min-width: 0;
  }
}
</style>
