<script setup lang="ts">
import { onMounted } from 'vue'
import RegisterForm from '../../components/auth/RegisterForm.vue'

// Change page title
onMounted(() => {
  document.title = 'Cadastro | Gestão de Funcionários'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        Crie sua conta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Junte-se ao Sistema de Gestão de Funcionários
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <RegisterForm />
      </div>
    </div>
  </div>
</template>