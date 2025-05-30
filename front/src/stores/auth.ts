import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginUser, registerUser, fetchUserProfile } from '../services/api'
import type { User, LoginCredentials, RegisterData } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)
  const isLoading = ref(false)

  const storedToken = localStorage.getItem('auth_token')
  const storedUser = localStorage.getItem('user')

  if (storedToken) {
    token.value = storedToken
  }

  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }

  async function login(email: string, password: string): Promise<User> {
    isLoading.value = true

    try {
      const credentials: LoginCredentials = { email, password }
      const response = await loginUser(credentials)

      token.value = response.token
      user.value = response.user

      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return response.user
    } finally {
      isLoading.value = false
    }
  }

  async function register(email: string, password: string, name: string): Promise<User> {
    isLoading.value = true

    try {
      const userData: RegisterData = { name, email, password }
      const response = await registerUser(userData)

      token.value = response.token
      user.value = response.user

      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return response.user
    } finally {
      isLoading.value = false
    }
  }

  async function refreshUserProfile(): Promise<User> {
    if (!token.value) {
      throw new Error('Not authenticated')
    }

    isLoading.value = true

    try {
      const userData = await fetchUserProfile()
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    refreshUserProfile,
    logout
  }
})