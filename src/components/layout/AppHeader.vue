<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => {
  return (route.meta?.heading as string | undefined) ?? 'NORA HALE'
})

const backTo = computed(() => {
  return route.meta?.backTo as string | undefined
})

const emit = defineEmits<{
  toggleMenu: []
}>()
</script>

<template>
  <header class="header">
    <div class="header-content">
      <button class="header__menu-button | btn-icon" @click="emit('toggleMenu')">
        <i v-lucide="'menu'" />
      </button>
      <button v-if="backTo" class="btn-icon" @click="router.push(backTo)">
        <i v-lucide="'arrow-left'" />
      </button>
      <h1 class="header__title">{{ pageTitle }}</h1>
    </div>
  </header>
</template>

<style scoped>
.header {
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
}

.header-content {
  display: flex;
  gap: var(--size-100);
  align-items: center;
}

.btn-icon {
  border: none;
}

.header__menu-button {
  display: none;
}

.header-content:not(:has(.btn-icon:not(.header__menu-button))) {
  margin-left: var(--size-300);
}

.header__title {
  font-family: var(--font-serif);
  font-size: var(--fs-500);
  font-weight: 600;
}

@media screen and (max-width: 768px) {
  .header {
    padding-inline: var(--size-200);
  }

  .header-content {
    width: 100%;
    overflow: hidden;
  }

  .header-content:not(:has(.btn-icon:not(.header__menu-button))) {
    margin-left: 0;
  }

  .header__title {
    min-width: 0;
  }
}

@media screen and (max-width: 1180px) and (min-width: 769px) {
  .header__menu-button {
    display: flex;
  }

  .header-content:not(:has(.btn-icon:not(.header__menu-button))) {
    margin-left: 0;
  }
}
</style>
