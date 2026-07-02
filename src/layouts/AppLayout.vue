<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebarResponsive from '@/components/layout/AppSidebarResponsive.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebarResponsive v-slot="{ toggleMenu }">
      <AppHeader class="header" @toggle-menu="toggleMenu" />
    </AppSidebarResponsive>
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: grid;
  grid-template-areas:
    'sidebar header'
    'sidebar main';
  grid-template-rows: auto 1fr;
  grid-template-columns: 260px auto;
  height: 100vh;
  overflow: hidden;
}

.header {
  grid-area: header;
  margin: 16px;
}

.main {
  grid-area: main;
  padding: 0 var(--size-300) var(--size-300) var(--size-300);
  overflow-y: auto;
}

@media screen and (max-width: 1180px) and (min-width: 769px) {
  .app-layout {
    grid-template-areas:
      'header'
      'main';
    grid-template-columns: minmax(0, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .app-layout {
    display: flex;
    flex-direction: column;
    height: auto;
  }
}
</style>
