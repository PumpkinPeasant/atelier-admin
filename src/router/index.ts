import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { setAuthErrorHandler } from '@/services/http'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Навигационный гард: при первом заходе восстанавливаем сессию из кук,
// затем пускаем/не пускаем по meta.requiresAuth.
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.fetchMe()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && auth.isAuthenticated()) {
    return { name: 'home' }
  }

  return true
})

// Если refresh окончательно не удался — сбрасываем стор и уводим на логин.
setAuthErrorHandler(() => {
  const auth = useAuthStore()
  const wasAuthenticated = auth.isAuthenticated()
  auth.reset()

  if (wasAuthenticated) {
    useNotificationsStore().info('Сессия истекла. Войдите снова.')
  }

  const redirect = router.currentRoute.value.fullPath
  router.push({
    name: 'login',
    query: redirect && redirect !== '/login' ? { redirect } : undefined,
  })
})

export default router
