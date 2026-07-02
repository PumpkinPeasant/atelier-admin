import { ref } from 'vue'
import { defineStore } from 'pinia'

export type NotificationType = 'success' | 'error' | 'info'

export interface Notification {
  id: number
  type: NotificationType
  message: string
  title?: string
}

interface PushOptions {
  title?: string
  /** Мс до авто-закрытия. 0 — не закрывать автоматически. */
  timeout?: number
}

const DEFAULT_TIMEOUT: Record<NotificationType, number> = {
  success: 4000,
  info: 5000,
  error: 7000,
}

/**
 * Очередь всплывающих уведомлений (тостов): ошибки, инфо, саксессы.
 * Рендерится компонентом NotificationHost, смонтированным в App.vue.
 */
export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<Notification[]>([])
  const timers = new Map<number, ReturnType<typeof setTimeout>>()
  let seq = 0

  function dismiss(id: number): void {
    items.value = items.value.filter((n) => n.id !== id)
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
  }

  function push(
    type: NotificationType,
    message: string,
    options: PushOptions = {},
  ): number {
    const id = ++seq
    items.value.push({ id, type, message, title: options.title })

    const timeout = options.timeout ?? DEFAULT_TIMEOUT[type]
    if (timeout > 0) {
      timers.set(
        id,
        setTimeout(() => dismiss(id), timeout),
      )
    }
    return id
  }

  const success = (message: string, options?: PushOptions) =>
    push('success', message, options)
  const info = (message: string, options?: PushOptions) =>
    push('info', message, options)
  const error = (message: string, options?: PushOptions) =>
    push('error', message, options)

  return { items, push, success, info, error, dismiss }
})
