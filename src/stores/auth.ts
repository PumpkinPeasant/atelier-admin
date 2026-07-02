import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '@/services/http'

export interface Admin {
  id: number
  email: string
  is_active: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Admin | null>(null)
  // Восстановили ли мы сессию из кук хотя бы раз (для навигационного гарда).
  const initialized = ref(false)

  const isAuthenticated = () => user.value !== null

  async function login(email: string, password: string): Promise<void> {
    const { data } = await http.post<Admin>('/admin/auth/login', {
      email,
      password,
    })
    user.value = data
    initialized.value = true
  }

  /** Пытается подтянуть текущего админа по access-куке. Тихо гасит 401. */
  async function fetchMe(): Promise<void> {
    try {
      const { data } = await http.get<Admin>('/admin/auth/me')
      user.value = data
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  async function logout(): Promise<void> {
    try {
      await http.post('/admin/auth/logout')
    } finally {
      user.value = null
    }
  }

  /** Локальный сброс без запроса — на случай протухшей сессии. */
  function reset(): void {
    user.value = null
  }

  return { user, initialized, isAuthenticated, login, fetchMe, logout, reset }
})
