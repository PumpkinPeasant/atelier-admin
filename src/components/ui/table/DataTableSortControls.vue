<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean | null | undefined
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | null): void
}>()

const toggleSort = () => {
  let nextValue: boolean | null

  if (props.modelValue === null || props.modelValue === undefined) nextValue = false
  else if (!props.modelValue) nextValue = true
  else nextValue = null

  emit('update:modelValue', nextValue)
}

const sortTitle = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return 'Без сортировки'
  return props.modelValue ? 'Сортировка по убыванию' : 'Сортировка по возрастанию'
})
</script>

<template>
  <div class="sort-control">
    <button
      :title="sortTitle"
      class="btn-secondary-icon sort-btn"
      :class="{ 'sort-btn--active': modelValue !== null && modelValue !== undefined }"
      @click="toggleSort"
    >
      <i v-if="modelValue === true" v-lucide="'chevron-down'" />
      <i v-else-if="modelValue === false" v-lucide="'chevron-up'" />
      <i v-else v-lucide="'chevrons-up-down'" />
    </button>
  </div>
</template>

<style scoped>
.sort-control {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sort-btn {
  color: var(--clr-neutral-500);
}

.sort-btn:hover {
  color: var(--clr-neutral-700);
}

.sort-btn--active {
  color: var(--clr-accent-500);
  background: var(--clr-accent-soft);
}

.sort-btn--active:hover {
  color: var(--clr-accent-600);
  background: var(--clr-accent-soft);
}
</style>
