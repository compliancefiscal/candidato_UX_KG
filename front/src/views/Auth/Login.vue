<script setup lang="ts">
import { onMounted } from 'vue'
import LoginForm from '../../components/auth/LoginForm.vue'

onMounted(() => {
  document.title = 'Login | Gestão de Funcionários'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        Entre na sua conta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Acesse o Sistema de Gestão de Funcionários
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <LoginForm />
      </div>
    </div>
  </div>
</template>