<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useToast } from '../../composables/useToast'
import LoadingSpinner from '../ui/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errors = ref({
  email: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  errors.value.email = ''
  errors.value.password = ''

  if (!email.value) {
    errors.value.email = 'E-mail é obrigatório'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Por favor, insira um e-mail válido'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = 'Senha é obrigatória'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Senha deve ter pelo menos 6 caracteres'
    isValid = false
  }

  return isValid
}

const login = async () => {
  if (!validateForm()) return

  try {
    isLoading.value = true
    await authStore.login(email.value, password.value)
    toast.success('Login realizado com sucesso! Bem-vindo de volta!')
    router.push('/employees')
  } catch (error) {
    toast.error('Login falhou. Verifique suas credenciais e tente novamente.')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="login" class="space-y-4 w-full max-w-md">
    <div>
      <label for="email" class="form-label">E-mail</label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="form-input"
        :class="{ 'border-red-500': errors.email }"
        placeholder="voce@exemplo.com"
      />
      <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
    </div>

    <div>
      <label for="password" class="form-label">Senha</label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="form-input"
        :class="{ 'border-red-500': errors.password }"
        placeholder="••••••••"
      />
      <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
    </div>

    <button
      type="submit"
      class="btn btn-primary w-full flex justify-center"
      :disabled="isLoading"
    >
      <LoadingSpinner v-if="isLoading" />
      <span v-else>Entrar</span>
    </button>

    <div class="text-sm text-center mt-4">
      <p class="text-gray-600">
        Não tem uma conta?
        <router-link
          to="/register"
          class="text-primary-600 hover:text-primary-800 font-medium"
        >
          Cadastre-se
        </router-link>
      </p>
    </div>
  </form>
</template>