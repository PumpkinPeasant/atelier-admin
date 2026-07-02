<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'

const authStore = useAuthStore()
const notifications = useNotificationsStore()
const router = useRouter()

const isActive = defineModel<boolean>('isActive', { default: false })

defineProps<{
  isDrawer?: boolean
}>()

const emit = defineEmits<{
  navigate: []
}>()

type NavLink = { title: string; href: string; icon: string }
type NavGroup = { title: string; links: NavLink[] }

const groups: NavGroup[] = [
  {
    title: 'Основное',
    links: [{ title: 'Главная', href: '/', icon: 'layout-dashboard' }],
  },
  {
    title: 'Справочники',
    links: [
      { title: 'Материалы', href: '/references/materials', icon: 'package' },
      { title: 'Цвета', href: '/references/colors', icon: 'palette' },
      { title: 'Размеры', href: '/references/sizes', icon: 'ruler' },
      { title: 'Группы категорий', href: '/references/category-groups', icon: 'folder-tree' },
      { title: 'Категории', href: '/references/categories', icon: 'shapes' },
    ],
  },
]

const handleNavigate = () => {
  emit('navigate')
}

const logout = async () => {
  handleNavigate()
  await authStore.logout()
  notifications.info('Вы вышли из панели')
  router.push({ name: 'login' })
}
</script>

<template>
  <aside
    class="sidebar"
    :class="[{ 'sidebar__menu-active': isActive }, { 'sidebar--drawer': isDrawer }]"
  >
    <div class="sidebar__header">
      <RouterLink class="sidebar__logo" to="/" @click="handleNavigate">
        <span class="sidebar__logo-name">NORA HALE</span>
        <span class="sidebar__logo-sub">atelier</span>
      </RouterLink>

      <button @click="isActive = !isActive" class="sidebar__menu-icon | btn-icon">
        <i v-lucide="isActive ? 'x' : 'menu'" />
      </button>
    </div>

    <hr class="sidebar__divider" />

    <nav class="sidebar__nav">
      <div class="sidebar__group" v-for="group in groups" :key="group.title">
        <p class="sidebar__group-title">{{ group.title }}</p>

        <div class="sidebar__group-links">
          <RouterLink
            class="sidebar__link"
            exact-active-class="sidebar__link-active"
            v-for="link in group.links"
            :key="link.href"
            :to="link.href"
            @click="handleNavigate"
          >
            <i v-lucide="link.icon" />
            {{ link.title }}
          </RouterLink>
        </div>
      </div>
    </nav>

    <div class="spacer" style="flex: 1 1 auto" />

    <hr class="sidebar__divider" />

    <div v-if="authStore.user" class="sidebar__user" :title="authStore.user.email">
      {{ authStore.user.email }}
    </div>

    <button class="btn-regular" @click="logout">
      <i v-lucide="'log-out'" />
      Выход
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  grid-area: sidebar;
  gap: var(--size-200);
  padding: var(--size-400) var(--size-300);
  overflow-y: auto;
  background: var(--clr-neutral-100);
  border-right: 1px solid var(--clr-neutral-400);
  transition: max-height 0.4s ease;
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--size-100);
}

.sidebar__logo {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding-inline: var(--size-200);
}

.sidebar__logo-name {
  font-family: var(--font-serif);
  font-size: 20px;
  letter-spacing: 0.14em;
  color: var(--color-text);
}

.sidebar__logo-sub {
  font-size: 11px;
  letter-spacing: 0.32em;
  color: var(--color-text-muted);
}

.btn-icon {
  border: none;
}

@media screen and (max-width: 768px) {
  .sidebar {
    max-height: 84px;
    overflow-y: hidden;
  }

  .sidebar__header {
    margin-bottom: 0;
  }

  .sidebar__menu-active {
    max-height: 999px;
  }
}

@media screen and (min-width: 769px) {
  .sidebar__menu-icon {
    display: none;
  }
}

.sidebar__divider {
  height: 1px;
  background: var(--clr-neutral-400);
  border: none;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--size-300);
}

.sidebar__group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar__group-title {
  padding: 0 var(--size-200);
  margin-bottom: var(--size-100);
  font-size: var(--fs-50);
  font-weight: var(--fw-bold);
  color: var(--clr-neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sidebar__group-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar__link {
  position: relative;
  display: flex;
  gap: var(--size-100);
  align-items: center;
  padding: var(--size-100) var(--size-200);
  font-size: var(--fs-100);
  color: var(--clr-neutral-700);
  white-space: nowrap;
  text-decoration: none;
  border-radius: var(--btn-border-radius);
  transition: background 0.2s ease, color 0.2s ease;
}

.sidebar__link:hover {
  background: var(--clr-neutral-300);
}

.sidebar__link-active {
  color: var(--clr-accent-500);
  background: var(--clr-accent-soft);
}

.sidebar__link-active::after {
  position: absolute;
  top: var(--size-100);
  right: 0;
  bottom: var(--size-100);
  width: 3px;
  content: '';
  background-color: var(--clr-accent-500);
  border-radius: 50px;
}

.sidebar__link-active:hover {
  color: var(--clr-accent-600);
}

.sidebar__user {
  padding: 0 var(--size-200);
  overflow: hidden;
  font-size: var(--fs-50);
  color: var(--clr-neutral-600);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
