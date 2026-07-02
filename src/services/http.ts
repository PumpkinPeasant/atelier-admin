import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'

/**
 * Единая точка входа для всех запросов к API.
 *
 * Авторизация — на httpOnly-куках (access/refresh JWT), поэтому токены
 * не хранятся в JS: браузер сам прикладывает куки при `withCredentials`.
 * При 401 один раз пытаемся молча обновить access через /admin/auth/refresh
 * и повторяем исходный запрос. Параллельные 401 разделяют один refresh.
 */
export const http: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Помечаем повторно отправленный запрос, чтобы не зациклить refresh.
interface RetriableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// Эндпоинты авторизации сами по себе не должны триггерить refresh.
const AUTH_ENDPOINTS = ['/admin/auth/login', '/admin/auth/refresh']

function isAuthEndpoint(url: string | undefined): boolean {
  return !!url && AUTH_ENDPOINTS.some((path) => url.includes(path))
}

// Single-flight: пока идёт один refresh, остальные ждут его же.
let refreshPromise: Promise<void> | null = null

function refreshTokens(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = http
      .post('/admin/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

// Колбэк, вызываемый когда сессия окончательно протухла (refresh не удался).
let onAuthError: (() => void) | null = null

export function setAuthErrorHandler(handler: () => void): void {
  onAuthError = handler
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableRequest | undefined
    const status = error.response?.status

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint(original.url)
    ) {
      original._retry = true
      try {
        await refreshTokens()
        return http(original)
      } catch {
        onAuthError?.()
      }
    }

    return Promise.reject(error)
  },
)

export default http
