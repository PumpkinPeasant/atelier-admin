<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppOverlay from '@/components/ui/AppOverlay.vue'

const router = useRouter()
const isNavigationActive = ref(false)
const isSidebarDrawerMode = ref(false)
let sidebarDrawerMedia: MediaQueryList | null = null
let removeRouterAfterEach: (() => void) | null = null

const closeNavigation = () => {
  isNavigationActive.value = false
}

const toggleNavigation = () => {
  isNavigationActive.value = !isNavigationActive.value
}

const handleSidebarDrawerMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
  isSidebarDrawerMode.value = event.matches

  if (!event.matches) {
    closeNavigation()
  }
}

onMounted(() => {
  sidebarDrawerMedia = window.matchMedia('(min-width: 769px) and (max-width: 1180px)')
  handleSidebarDrawerMediaChange(sidebarDrawerMedia)
  sidebarDrawerMedia.addEventListener('change', handleSidebarDrawerMediaChange)

  removeRouterAfterEach = router.afterEach(() => {
    closeNavigation()
  })
})

onBeforeUnmount(() => {
  sidebarDrawerMedia?.removeEventListener('change', handleSidebarDrawerMediaChange)
  removeRouterAfterEach?.()
})
</script>

<template>
  <div class="navigation-responsive-wrapper">
    <AppOverlay
      @on-escape="closeNavigation"
      @on-click="closeNavigation"
      v-if="isNavigationActive && isSidebarDrawerMode"
      overlay-class="sidebar-drawer-overlay"
    >
      <template #content>
        <AppSidebar
          v-model:is-active="isNavigationActive"
          class="sidebar-drawer"
          is-drawer
          @navigate="closeNavigation"
        />
      </template>
    </AppOverlay>

    <AppSidebar
      v-model:is-active="isNavigationActive"
      class="layout-sidebar"
      @navigate="closeNavigation"
    />

    <slot :toggle-menu="toggleNavigation" />
  </div>
</template>

<style scoped>
.navigation-responsive-wrapper {
  display: contents;
}

.layout-sidebar {
  grid-area: sidebar;
}

@media screen and (max-width: 1180px) and (min-width: 769px) {
  .layout-sidebar {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .layout-sidebar {
    display: flex;
  }
}

:deep(.sidebar-drawer-overlay) {
  align-items: stretch;
  justify-content: flex-start;
  padding: 0;
}

.sidebar-drawer {
  width: 280px;
  max-width: min(82vw, 320px);
  height: 100dvh;
  box-shadow: 10px 0 30px rgba(36, 33, 28, 0.12);
  animation: sidebar-drawer-slide 0.18s ease;
}

@keyframes sidebar-drawer-slide {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}
</style>
