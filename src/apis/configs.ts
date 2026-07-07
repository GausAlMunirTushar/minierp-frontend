import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

import { authStore } from '@/lib/auth'
import { STORAGE_KEYS } from '@/configs/constants'
import type { ApiErrorResponse } from '@/apis/types/common_type'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'
export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '')

export type NormalizedApiError = {
  status?: number
  message: string
  errors: unknown[]
}

export const AxiosAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

AxiosAPI.interceptors.request.use((config) => {
  const token = authStore.getToken()
  const locale = localStorage.getItem(STORAGE_KEYS.LOCALE) || 'en'

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  config.headers['Accept-Language'] = locale === 'bn' ? 'bn' : 'en'

  return config
})

const redirectToLogin = () => {
  if (window.location.pathname === '/login') return

  const next = `${window.location.pathname}${window.location.search}`
  window.location.assign(`/login?next=${encodeURIComponent(next)}&message=session_expired`)
}

AxiosAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.logout()
      redirectToLogin()
    }

    return Promise.reject(error)
  },
)

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return {
      status: error.response?.status,
      message: error.response?.data?.message || error.message || 'Request failed',
      errors: error.response?.data?.errors ?? [],
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      errors: [],
    }
  }

  return {
    message: 'Something went wrong',
    errors: [],
  }
}

export const getApiErrorMessage = (error: unknown) => normalizeApiError(error).message

export const AxiosFetcher = async <T>(url: string, config?: AxiosRequestConfig) =>
  AxiosAPI.get<T>(url, config).then((res) => res.data)

export const ApiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    AxiosAPI.get<T>(url, config).then((res) => res.data),
  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    AxiosAPI.post<T>(url, data, config).then((res) => res.data),
  patch: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    AxiosAPI.patch<T>(url, data, config).then((res) => res.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    AxiosAPI.delete<T>(url, config).then((res) => res.data),
  form: <T>(method: 'post' | 'patch', url: string, data: FormData) =>
    AxiosAPI.request<T>({
      url,
      method,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data),
}

export type ApiAxiosError = AxiosError<ApiErrorResponse>
