<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '../../stores/employees'
import { useToast } from '../../composables/useToast'
import EmployeeForm from '../../components/employees/EmployeeForm.vue'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const employeeStore = useEmployeeStore()
const toast = useToast()

const employeeId = route.params.id as string
const employee = ref(employeeStore.getEmployeeById(employeeId))
const isLoading = ref(false)

// Change page title
onMounted(() => {
  document.title = 'Editar Funcionário | Gestão de Funcionários'
  
  if (!employee.value) {
    toast.error('Funcionário não encontrado')
    router.push('/employees')
  }
})

const handleSubmit = (employeeData: Omit<any, 'id'>) => {
  isLoading.value = true
  
  setTimeout(() => {
    const updated = employeeStore.updateEmployee(employeeId, employeeData)
    
    if (updated) {
      toast.success('Funcionário atualizado com sucesso!')
      router.push('/employees')
    } else {
      toast.error('Falha ao atualizar o funcionário')
    }
    
    isLoading.value = false
  }, 500)
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
          <h1 class="text-xl font-semibold text-gray-900">Editar Funcionário</h1>
        </div>
      </div>
    </header>
    
    <!-- Main content -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner message="Loading employee data..." />
      </div>
      <EmployeeForm 
        v-else-if="employee"
        :employee="employee"
        :is-editing="true"
        @submit="handleSubmit" 
        @cancel="handleCancel" 
      />
    </main>
  </div>
</template>