import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type User = {
  id: string;
  email: string;
  name: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // Initialize from local storage if available
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }

  function login(email: string, password: string): Promise<User> {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock successful login for demonstration
        if (email && password) {
          const newUser = {
            id: crypto.randomUUID(),
            email,
            name: email.split('@')[0]
          }
          user.value = newUser
          localStorage.setItem('user', JSON.stringify(newUser))
          resolve(newUser)
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 800) // Simulate API delay
    })
  }

  function register(email: string, password: string, name: string): Promise<User> {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock successful registration
        if (email && password && name) {
          const newUser = {
            id: crypto.randomUUID(),
            email,
            name
          }
          user.value = newUser
          localStorage.setItem('user', JSON.stringify(newUser))
          resolve(newUser)
        } else {
          reject(new Error('Invalid registration data'))
        }
      }, 800) // Simulate API delay
    })
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
})