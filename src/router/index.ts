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
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: { requiresAuth: true, heading: 'Главная панель' },
        },
        {
          path: 'references',
          redirect: { name: 'reference-materials' },
          meta: { requiresAuth: true },
        },
        {
          path: 'references/materials',
          name: 'reference-materials',
          component: () => import('@/views/references/MaterialsView.vue'),
          meta: { requiresAuth: true, heading: 'Материалы' },
        },
        {
          path: 'references/colors',
          name: 'reference-colors',
          component: () => import('@/views/references/ColorsView.vue'),
          meta: { requiresAuth: true, heading: 'Цвета' },
        },
        {
          path: 'references/sizes',
          name: 'reference-sizes',
          component: () => import('@/views/references/SizesView.vue'),
          meta: { requiresAuth: true, heading: 'Размеры' },
        },
        {
          path: 'references/category-groups',
          name: 'reference-category-groups',
          component: () => import('@/views/references/CategoryGroupsView.vue'),
          meta: { requiresAuth: true, heading: 'Группы категорий' },
        },
        {
          path: 'references/categories',
          name: 'reference-categories',
          component: () => import('@/views/references/CategoriesView.vue'),
          meta: { requiresAuth: true, heading: 'Категории' },
        },
        {
          path: 'products/info',
          name: 'products-info',
          component: () => import('@/views/products/ProductInfoView.vue'),
          meta: { requiresAuth: true, heading: 'Информация о товарах' },
        },
        {
          path: 'site/product-cards',
          name: 'site-product-cards',
          component: () => import('@/views/site/ProductCardsAdminView.vue'),
          meta: { requiresAuth: true, heading: 'Карточки товаров на сайте' },
        },
      ],
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
