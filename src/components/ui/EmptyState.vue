<script setup lang="ts">
import EmojiNeutralIcon from '@/components/icons/EmojiNeutralIcon.vue'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    icon?: string
  }>(),
  {
    title: 'Нет данных',
    description: 'Когда записи появятся, они будут отображаться в этой таблице.',
  },
)
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <EmojiNeutralIcon v-if="!icon" />
      <i v-else v-lucide="icon"></i>
    </div>

    <div class="empty-state__content">
      <p class="empty-state__title">{{ title }}</p>
      <p class="empty-state__description">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  gap: var(--size-300);
  align-items: center;
  justify-content: center;
  padding: var(--size-800) var(--size-400);
  text-align: center;
}

.empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  color: var(--clr-accent-500);
  background: var(--clr-accent-soft);
  border-radius: var(--radius-md);
}

.empty-state__icon :deep(svg) {
  font-size: var(--fs-700);
}

.empty-state__content {
  display: flex;
  flex-direction: column;
  gap: var(--size-100);
}

.empty-state__title {
  font-size: var(--fs-300);
  font-weight: var(--fw-bold);
  color: var(--clr-neutral-800);
}

.empty-state__description {
  font-size: var(--fs-100);
  color: var(--clr-neutral-600);
}
</style>
