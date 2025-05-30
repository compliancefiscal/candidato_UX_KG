<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Employee } from '../../stores/employees'
import { useToast } from '../../composables/useToast'
import LoadingSpinner from '../ui/LoadingSpinner.vue'

const props = defineProps<{
  employee?: Employee
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', employee: Omit<Employee, 'id'>): void
  (e: 'cancel'): void
}>()

const toast = useToast()
const isLoading = ref(false)

const formTitle = computed(() => props.isEditing ? 'Editar Funcionário' : 'Adicionar Novo Funcionário')
const submitButtonText = computed(() => props.isEditing ? 'Atualizar Funcionário' : 'Criar Funcionário')

// Form data
const name = ref(props.employee?.name || '')
const email = ref(props.employee?.email || '')
const role = ref(props.employee?.role || '')
const department = ref(props.employee?.department || '')
const hireDate = ref(props.employee?.hireDate || new Date().toISOString().split('T')[0])
const salary = ref(props.employee?.salary?.toString() || '')

// Form validation
const errors = ref({
  name: '',
  email: '',
  role: '',
  department: '',
  hireDate: '',
  salary: ''
})

// Department options
const departments = [
  'Engenharia',
  'Design',
  'Marketing',
  'Vendas',
  'Finanças',
  'RH',
  'Produto',
  'Operações',
  'Suporte ao Cliente',
]

// Role options
const roles = [
  'Desenvolvedor',
  'Designer',
  'Gerente',
  'Gerente de Produtos',
  'QA',
  'DevOps',
  'Analista de Dados',
  'Especialista em Marketing',
  'Representante de Vendas',
  'Especialista em RH'
]

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  // Validate required fields
  if (!name.value.trim()) {
    errors.value.name = 'Nome é obrigatório'
    isValid = false
  }

  if (!email.value.trim()) {
    errors.value.email = 'E-mail é obrigatório'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Por favor, insira um e-mail válido'
    isValid = false
  }

  if (!role.value) {
    errors.value.role = 'A função é obrigatória'
    isValid = false
  }

  if (!department.value) {
    errors.value.department = 'O departamento é obrigatório'
    isValid = false
  }

  if (!hireDate.value) {
    errors.value.hireDate = 'A data de contratação é obrigatória'
    isValid = false
  }

  if (!salary.value) {
    errors.value.salary = 'O salário é obrigatório'
    isValid = false
  } else if (isNaN(Number(salary.value)) || Number(salary.value) <= 0) {
    errors.value.salary = 'O salário deve ser um número positivo'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (!validateForm()) {
    toast.error('Por favor, corrija os erros no formulário')
    return
  }

  isLoading.value = true
  
  // Simulate API delay
  setTimeout(() => {
    try {
      const employeeData = {
        name: name.value,
        email: email.value,
        role: role.value,
        department: department.value,
        hireDate: hireDate.value,
        salary: Number(salary.value)
      }
      
      emit('submit', employeeData)
    } catch (error) {
      toast.error('Ocorreu um erro ao salvar o funcionário')
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }, 800)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-6">{{ formTitle }}</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            placeholder="joao.silva@exemplo.com"
          />
          <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
        </div>

        <div>
          <label for="role" class="form-label">Função</label>
          <select 
            id="role" 
            v-model="role" 
            class="form-input" 
            :class="{ 'border-red-500': errors.role }"
          >
            <option value="" disabled>Selecione um cargo</option>
            <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
          </select>
          <p v-if="errors.role" class="form-error">{{ errors.role }}</p>
        </div>

        <div>
          <label for="department" class="form-label">Departmento</label>
          <select 
            id="department" 
            v-model="department" 
            class="form-input" 
            :class="{ 'border-red-500': errors.department }"
          >
            <option value="" disabled>Selecione um departmento</option>
            <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
          </select>
          <p v-if="errors.department" class="form-error">{{ errors.department }}</p>
        </div>

        <div>
          <label for="hireDate" class="form-label">Data de Contratação</label>
          <input 
            id="hireDate" 
            v-model="hireDate" 
            type="date" 
            class="form-input" 
            :class="{ 'border-red-500': errors.hireDate }"
          />
          <p v-if="errors.hireDate" class="form-error">{{ errors.hireDate }}</p>
        </div>

        <div>
          <label for="salary" class="form-label">Salário</label>
          <input 
            id="salary" 
            v-model="salary" 
            type="number" 
            class="form-input" 
            :class="{ 'border-red-500': errors.salary }"
            placeholder="80000"
            min="0"
            step="1000"
          />
          <p v-if="errors.salary" class="form-error">{{ errors.salary }}</p>
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <button 
          type="button" 
          @click="handleCancel" 
          class="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          class="btn btn-primary flex items-center justify-center min-w-[120px]" 
          :disabled="isLoading"
        >
          <LoadingSpinner v-if="isLoading" />
          <span v-else>{{ submitButtonText }}</span>
        </button>
      </div>
    </form>
  </div>
</template>