<script setup lang="ts">
import LoadingRingIcon from '@/components/icons/LoadingRingIcon.vue'
</script>

<template>
  <div class="loading" v-once>
    <div class="loading__icon">
      <LoadingRingIcon />
    </div>

    <div class="loading__content">
      <p class="loading__title">Загрузка...</p>
      <p class="loading__description">Данные загружаются. Пожалуйста, подождите...</p>
    </div>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  gap: var(--size-300);
  align-items: center;
  justify-content: center;
  padding: var(--size-800) var(--size-400);
  text-align: center;
}

.loading__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--clr-accent-500);
}

.loading__icon :deep(svg) {
  font-size: var(--fs-800);
}

.loading__content {
  display: flex;
  flex-direction: column;
  gap: var(--size-100);
}

.loading__title {
  font-size: var(--fs-300);
  font-weight: var(--fw-bold);
  color: var(--clr-neutral-800);
}

.loading__description {
  font-size: var(--fs-100);
  color: var(--clr-neutral-600);
}
</style>
