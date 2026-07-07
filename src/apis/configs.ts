import axios from 'axios'

import { authStore } from '@/lib/auth'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '')

export const AxiosAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

AxiosAPI.interceptors.request.use((config) => {
  const token = authStore.getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

AxiosAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.logout()
    }

    return Promise.reject(error)
  },
)

export const AxiosFetcher = async <T>(url: string) => AxiosAPI.get<T>(url).then((res) => res.data)
