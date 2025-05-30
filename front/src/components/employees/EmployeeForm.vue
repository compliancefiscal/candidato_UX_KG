<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Employee } from '../../types'
import { useToast } from '../../composables/useToast'
import LoadingSpinner from '../ui/LoadingSpinner.vue'
import { useAuthStore } from '../../stores/auth'
import { vMaska } from 'maska/vue'

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
const authStore = useAuthStore()

const formTitle = computed(() => props.isEditing ? 'Editar Funcionário' : 'Adicionar Novo Funcionário')
const submitButtonText = computed(() => props.isEditing ? 'Atualizar Funcionário' : 'Criar Funcionário')

const formatPhone = (value: string): string => {
  if (!value) return ''
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

const unformatPhone = (value: string): string => {
  return value.replace(/\D/g, '')
}

const formatZipCode = (value: string): string => {
  if (!value) return ''
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
}

const unformatZipCode = (value: string): string => {
  return value.replace(/\D/g, '')
}

const name = ref(props.employee?.name || '')
const address = ref(props.employee?.address || '')
const neighborhood = ref(props.employee?.neighborhood || '')
const zipCode = ref(props.employee?.zipCode || '')
const phone = ref(props.employee?.phone || '')
const role = ref(props.employee?.role || '')
const salary = ref(props.employee?.salary?.toString() || '')
const contractDate = ref(props.employee?.contractDate || new Date().toISOString().split('T')[0])

const formattedPhone = computed({
  get: () => formatPhone(phone.value),
  set: (value) => { phone.value = unformatPhone(value) }
})

const formattedZipCode = computed({
  get: () => formatZipCode(zipCode.value),
  set: (value) => { zipCode.value = unformatZipCode(value) }
})

const formattedSalary = computed<string>({
  get() {
    const cents = parseInt(salary.value, 10) || 0  
    const value = cents / 100  
    return new Intl.NumberFormat('pt-BR', {
      style:    'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  },
  set(val: string) {
    const numeric = val.replace(/\D/g, '')  
    salary.value = (parseInt(numeric, 10) || 0).toString()  
  }
})

const errors = ref({
  name: '',
  address: '',
  neighborhood: '',
  zipCode: '',
  phone: '',
  role: '',
  contractDate: '',
  salary: ''
})

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
  
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })

  if (!name.value.trim()) {
    errors.value.name = 'Nome é obrigatório'
    isValid = false
  }

  if (!address.value.trim()) {
    errors.value.address = 'Endereço é obrigatório'
    isValid = false
  }

  if (zipCode.value && !/^\d{8}$/.test(zipCode.value)) {
    errors.value.zipCode = 'CEP deve conter 8 dígitos'
    isValid = false
  }

  if (phone.value && !/^\d{10,11}$/.test(phone.value)) {
    errors.value.phone = 'Telefone deve conter 10 ou 11 dígitos'
    isValid = false
  }

  if (!role.value) {
    errors.value.role = 'A função é obrigatória'
    isValid = false
  }

  if (!contractDate.value) {
    errors.value.contractDate = 'A data de contratação é obrigatória'
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
  
  try {
    if (!authStore.user) {
      throw new Error('Usuário não autenticado')
    }

    const employeeData = {
      name: name.value,
      address: address.value,
      neighborhood: neighborhood.value,
      zipCode: zipCode.value,
      phone: phone.value,
      role: role.value,
      contractDate: contractDate.value,
      salary: Number(salary.value),
      ownerId: authStore.user.id
    }
    
    emit('submit', employeeData)
  } catch (error) {
    toast.error('Ocorreu um erro ao salvar o funcionário')
    console.error(error)
  } finally {
    isLoading.value = false
  }
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
          <label for="phone" class="form-label">Telefone</label>
          <input 
            id="phone" 
            v-model="formattedPhone" 
            type="text" 
            class="form-input" 
            :class="{ 'border-red-500': errors.phone }"
            placeholder="(11) 91234-5678"
            v-maska="'(##) #####-####'"
          />
          <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
        </div>

        <div>
          <label for="zipCode" class="form-label">CEP</label>
          <input 
            id="zipCode" 
            v-model="formattedZipCode" 
            type="text"
            class="form-input" 
            :class="{ 'border-red-500': errors.zipCode }"
            placeholder="00000-000"
            v-maska="'#####-###'"
          />
          <p v-if="errors.zipCode" class="form-error">{{ errors.zipCode }}</p>
        </div>

        <div>
          <label for="address" class="form-label">Endereço</label>
          <input 
            id="address" 
            v-model="address" 
            type="text"
            class="form-input" 
            :class="{ 'border-red-500': errors.address }"
            placeholder="Rua Exemplo, 123"
          />
          <p v-if="errors.address" class="form-error">{{ errors.address }}</p>
        </div>

        <div>
          <label for="neighborhood" class="form-label">Bairro</label>
          <input 
            id="neighborhood" 
            v-model="neighborhood" 
            type="text"
            class="form-input" 
            :class="{ 'border-red-500': errors.neighborhood }"
            placeholder="Vila Virgínia"
          />
          <p v-if="errors.neighborhood" class="form-error">{{ errors.neighborhood }}</p>
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
          <label for="contractDate" class="form-label">Data de Contratação</label>
          <input 
            id="contractDate" 
            v-model="contractDate" 
            type="date" 
            class="form-input" 
            :class="{ 'border-red-500': errors.contractDate }"
          />
          <p v-if="errors.contractDate" class="form-error">{{ errors.contractDate }}</p>
        </div>

        <div>
          <label for="salary" class="form-label">Salário</label>
          <input 
            id="salary" 
            v-model="formattedSalary" 
            type="text" 
            class="form-input" 
            :class="{ 'border-red-500': errors.salary }"
            placeholder="R$ 0,00"
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