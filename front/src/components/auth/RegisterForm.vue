<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useToast } from '../../composables/useToast'
import LoadingSpinner from '../ui/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateForm = () => {
  let isValid = true
  errors.value.name = ''
  errors.value.email = ''
  errors.value.password = ''
  errors.value.confirmPassword = ''

  if (!name.value) {
    errors.value.name = 'Nome é obrigatório'
    isValid = false
  }

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

  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'As senhas não coincidem'
    isValid = false
  }

  return isValid
}

const register = async () => {
  if (!validateForm()) return

  try {
    isLoading.value = true
    await authStore.register(email.value, password.value, name.value)
    toast.success('Cadastro realizado com sucesso! Bem-vindo ao Gestor de Funcionários!')
    router.push('/employees')
  } catch (error) {
    toast.error('Erro ao cadastrar. Verifique os dados e tente novamente.')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="register" class="space-y-4 w-full max-w-md">
    <div>
      <label for="name" class="form-label">Nome</label>
      <input
        id="name"
        v-model="name"
        type="text"
        class="form-input"
        :class="{ 'border-red-500': errors.name }"
        placeholder="João da Silva"
      />
      <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
    </div>

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

    <div>
      <label for="confirmPassword" class="form-label">Confirme a Senha</label>
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        class="form-input"
        :class="{ 'border-red-500': errors.confirmPassword }"
        placeholder="••••••••"
      />
      <p v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</p>
    </div>

    <button
      type="submit"
      class="btn btn-primary w-full flex justify-center"
      :disabled="isLoading"
    >
      <LoadingSpinner v-if="isLoading" />
      <span v-else>Inscrever-se</span>
    </button>

    <div class="text-sm text-center mt-4">
      <p class="text-gray-600">
        Já tem uma conta?
        <router-link
          to="/login"
          class="text-primary-600 hover:text-primary-800 font-medium"
        >
          Faça login
        </router-link>
      </p>
    </div>
  </form>
</template>