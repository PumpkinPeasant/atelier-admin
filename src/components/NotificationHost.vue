<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  useNotificationsStore,
  type NotificationType,
} from '@/stores/notifications'

const store = useNotificationsStore()
const { items } = storeToRefs(store)

const labels: Record<NotificationType, string> = {
  success: 'Готово',
  info: 'Информация',
  error: 'Ошибка',
}
</script>

<template>
  <Teleport to="body">
    <div class="host" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast">
        <div
          v-for="n in items"
          :key="n.id"
          class="toast"
          :class="`toast--${n.type}`"
          role="status"
        >
          <span class="toast__icon" aria-hidden="true">
            <svg
              v-if="n.type === 'success'"
              viewBox="0 0 20 20"
              width="18"
              height="18"
            >
              <path
                d="M4 10.5l4 4 8-9"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else-if="n.type === 'error'"
              viewBox="0 0 20 20"
              width="18"
              height="18"
            >
              <path
                d="M10 5.5v5M10 14h.01"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
            <svg v-else viewBox="0 0 20 20" width="18" height="18">
              <path
                d="M10 9v5M10 6h.01"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </span>

          <div class="toast__body">
            <span class="toast__title">{{ n.title ?? labels[n.type] }}</span>
            <span class="toast__message">{{ n.message }}</span>
          </div>

          <button
            class="toast__close"
            type="button"
            aria-label="Закрыть"
            @click="store.dismiss(n.id)"
          >
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path
                d="M4 4l8 8M12 4l-8 8"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.host {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 360px;
  max-width: calc(100vw - 40px);
  pointer-events: none;
}

.toast {
  --toast-accent: var(--color-accent);
  --toast-soft: var(--color-surface-muted);
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 12px 12px 14px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--toast-accent);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.toast--success {
  --toast-accent: var(--color-positive);
  --toast-soft: var(--color-positive-soft);
}

.toast--error {
  --toast-accent: var(--color-danger);
  --toast-soft: var(--color-danger-soft);
}

.toast--info {
  --toast-accent: var(--color-info);
  --toast-soft: var(--color-info-soft);
}

.toast__icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  color: var(--toast-accent);
  background-color: var(--toast-soft);
  border-radius: var(--radius-sm);
}

.toast__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
  padding-top: 1px;
}

.toast__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.toast__message {
  font-size: 13px;
  color: var(--color-text-secondary);
  word-wrap: break-word;
}

.toast__close {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.toast__close:hover {
  color: var(--color-text);
  background-color: var(--color-surface-muted);
}

/* Анимация появления/исчезновения */
.toast-enter-active,
.toast-leave-active {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.toast-leave-active {
  position: absolute;
  right: 0;
  width: 100%;
}
</style>
