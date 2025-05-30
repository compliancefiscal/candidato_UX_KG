<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '../../stores/employees'
import type { Employee } from '../../types'
import { useToast } from '../../composables/useToast'

const props = defineProps<{
  employees: Employee[]
}>()

const router = useRouter()
const employeeStore = useEmployeeStore()
const toast = useToast()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(amount)
}

const handleEdit = (id: string) => {
  router.push(`/employees/${id}/edit`)
}

const handleDelete = async (id: string) => {
  if (confirm('Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.')) {
    try {
      await employeeStore.deleteEmployee(id)
      toast.success('Funcionário excluído com sucesso!')
    } catch (error) {
      toast.error('Falha ao excluir funcionário. Tente novamente.')
    }
  }
}
</script>

<template>
  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th class="table-header">Nome</th>
          <th class="table-header">Função</th>
          <th class="table-header">Departamento</th>
          <th class="table-header">Data de Contratação</th>
          <th class="table-header">Salário</th>
          <th class="table-header">Ações</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-if="employees.length === 0">
          <td colspan="6" class="table-cell text-center text-gray-500">
            Nenhum funcionário encontrado. Adicione um novo funcionário para começar.
          </td>
        </tr>
        <tr 
          v-for="employee in employees" 
          :key="employee.id"
          class="hover:bg-gray-50 transition-colors"
        >
          <td class="table-cell font-medium text-gray-900">
            <div>{{ employee.name }}</div>
            <div class="text-sm text-gray-500">{{ employee.email }}</div>
          </td>
          <td class="table-cell text-gray-700">{{ employee.role }}</td>
          <td class="table-cell text-gray-700">{{ employee.department }}</td>
          <td class="table-cell text-gray-700">{{ formatDate(employee.hireDate) }}</td>
          <td class="table-cell text-gray-700">{{ formatCurrency(employee.salary) }}</td>
          <td class="table-cell text-right text-sm font-medium space-x-2">
            <button 
              @click="handleEdit(employee.id)" 
              class="text-primary-600 hover:text-primary-900"
            >
              Editar
            </button>
            <button 
              @click="handleDelete(employee.id)" 
              class="text-red-600 hover:text-red-900"
            >
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>