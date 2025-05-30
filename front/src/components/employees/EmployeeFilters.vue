<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useEmployeeStore } from '../../stores/employees'

const employeeStore = useEmployeeStore()
const nameFilter = ref(employeeStore.nameFilter)
const roleFilter = ref(employeeStore.roleFilter)
const roles = employeeStore.uniqueRoles

const applyFilters = () => {
  employeeStore.setNameFilter(nameFilter.value)
  employeeStore.setRoleFilter(roleFilter.value)
}

const resetFilters = () => {
  nameFilter.value = ''
  roleFilter.value = ''
  employeeStore.clearFilters()
}

// Update filter inputs if store values change
watchEffect(() => {
  nameFilter.value = employeeStore.nameFilter
  roleFilter.value = employeeStore.roleFilter
})
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6 animate-fade-in">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Filtrar Funcionários</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="nameFilter" class="form-label">Nome</label>
        <input
          id="nameFilter"
          v-model="nameFilter"
          type="text"
          class="form-input"
          placeholder="Procure pelo nome..."
          @input="applyFilters"
        />
      </div>
      <div>
        <label for="roleFilter" class="form-label">Função</label>
        <select
          id="roleFilter"
          v-model="roleFilter"
          class="form-input"
          @change="applyFilters"
        >
          <option value="">Todas</option>
          <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
        </select>
      </div>
      <div class="flex items-end">
        <button 
          @click="resetFilters" 
          class="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  </div>
</template>