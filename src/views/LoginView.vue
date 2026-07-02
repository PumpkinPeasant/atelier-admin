<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'

const auth = useAuthStore()
const notifications = useNotificationsStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    notifications.success('Вы вошли в панель')
    const redirect = route.query.redirect
    await router.replace(typeof redirect === 'string' ? redirect : { name: 'home' })
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 401) {
      error.value = 'Неверный email или пароль'
    } else {
      error.value = 'Не удалось войти. Попробуйте позже'
      notifications.error('Не удалось войти. Попробуйте позже')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <form class="card" @submit.prevent="onSubmit">
      <div class="brand">
        <span class="brand__name">NORA HALE</span>
        <span class="brand__sub">atelier</span>
      </div>

      <h1 class="title">Вход в панель</h1>
      <p class="subtitle">Войдите, чтобы управлять магазином.</p>

      <label class="field">
        <span class="field__label">Email</span>
        <input
          v-model="email"
          type="email"
          autocomplete="username"
          required
          placeholder="admin@example.com"
        />
      </label>

      <label class="field">
        <span class="field__label">Пароль</span>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          placeholder="••••••••"
        />
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <button class="submit" type="submit" :disabled="loading">
        {{ loading ? 'Входим…' : 'Войти' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background-color: var(--color-bg);
}

.card {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 40px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-bottom: 8px;
}

.brand__name {
  font-family: var(--font-serif);
  font-size: 24px;
  letter-spacing: 0.16em;
  color: var(--color-text);
}

.brand__sub {
  font-size: 12px;
  letter-spacing: 0.34em;
  text-transform: lowercase;
  color: var(--color-text-muted);
}

.title {
  font-size: 22px;
  text-align: center;
}

.subtitle {
  margin-top: -8px;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field__label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.field input {
  padding: 11px 14px;
  font-size: 15px;
  color: var(--color-text);
  background-color: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}

.error {
  margin: -4px 0 0;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--color-danger);
  background-color: var(--color-danger-soft);
  border-radius: var(--radius-sm);
}

.submit {
  margin-top: 4px;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-inverse);
  background-color: var(--color-accent);
  border: none;
  border-radius: var(--radius-md);
  transition: background-color 0.15s ease;
}

.submit:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
}

.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
