<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '../../stores/employees'
import { useToast } from '../../composables/useToast'
import EmployeeForm from '../../components/employees/EmployeeForm.vue'

const router = useRouter()
const employeeStore = useEmployeeStore()
const toast = useToast()

// Change page title
onMounted(() => {
  document.title = 'Adicionar Funcionário | Gestão de Funcionários'
})

const handleSubmit = (employeeData: Omit<any, 'id'>) => {
  employeeStore.addEmployee(employeeData)
  toast.success('Funcionário adicionado com sucesso!')
  router.push('/employees')
}

const handleCancel = () => {
  router.push('/employees')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center">
          <button
            @click="router.push('/employees')"
            class="mr-3 text-gray-500 hover:text-gray-700"
          >
            &larr;
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Adicionar Novo Funcionário</h1>
        </div>
      </div>
    </header>
    
    <!-- Main content -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EmployeeForm 
        @submit="handleSubmit" 
        @cancel="handleCancel" 
      />
    </main>
  </div>
</template>