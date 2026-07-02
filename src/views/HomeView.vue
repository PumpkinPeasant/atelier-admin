<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'

const auth = useAuthStore()
const notifications = useNotificationsStore()
const router = useRouter()

async function onLogout() {
  await auth.logout()
  notifications.info('Вы вышли из панели')
  router.replace({ name: 'login' })
}
</script>

<template>
  <main class="home">
    <div class="card">
      <div class="brand">
        <span class="brand__name">NORA HALE</span>
        <span class="brand__sub">atelier</span>
      </div>
      <h1 class="title">Главная панель</h1>
      <p class="subtitle">
        Вы вошли как <strong>{{ auth.user?.email }}</strong>
      </p>
      <button class="logout" type="button" @click="onLogout">Выйти</button>
    </div>
  </main>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.card {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
  text-align: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
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
  font-size: 22px;
  letter-spacing: 0.16em;
}

.brand__sub {
  font-size: 12px;
  letter-spacing: 0.34em;
  color: var(--color-text-muted);
}

.title {
  font-size: 24px;
}

.subtitle {
  color: var(--color-text-secondary);
}

.logout {
  margin-top: 12px;
  padding: 10px 20px;
  font-size: 14px;
  color: var(--color-text);
  background-color: var(--color-surface-muted);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  transition: background-color 0.15s ease;
}

.logout:hover {
  background-color: var(--color-accent-soft);
}
</style>
