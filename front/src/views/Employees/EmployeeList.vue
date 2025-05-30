<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '../../stores/employees'
import { useAuthStore } from '../../stores/auth'
import EmployeeTable from '../../components/employees/EmployeeTable.vue'
import EmployeeFilters from '../../components/employees/EmployeeFilters.vue'

const router = useRouter()
const employeeStore = useEmployeeStore()
const authStore = useAuthStore()

// Change page title
onMounted(() => {
  document.title = 'Funcionários | Gestão de Funcionários'
})

const handleAddEmployee = () => {
  router.push('/employees/create')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Gestão de Funcionários</h1>
        <div class="flex items-center space-x-4">
          <span class="text-gray-700">Bem-vindo, {{ authStore.user?.name }}</span>
          <button
            @click="handleLogout"
            class="text-primary-600 hover:text-primary-800 font-medium text-sm"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
    
    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Listagem de Funcionários</h2>
        <button
          @click="handleAddEmployee"
          class="btn btn-primary"
        >
          Adicionar Funcionário
        </button>
      </div>

      <!-- Filters -->
      <EmployeeFilters />
      
      <!-- Employee table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <EmployeeTable :employees="employeeStore.filteredEmployees" />
      </div>
    </main>
  </div>
</template>