import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Employee } from '../types'
import * as api from '../services/api'

export const useEmployeeStore = defineStore('employees', () => {
  const employees = ref<Employee[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const nameFilter = ref('')
  const roleFilter = ref('')

  const filteredEmployees = computed(() => {
    if (!employees.value) return []

    return employees.value.filter(employee => {
      const nameMatch = employee.name.toLowerCase().includes(nameFilter.value.toLowerCase())
      const roleMatch = !roleFilter.value || employee.role.toLowerCase() === roleFilter.value.toLowerCase()
      return nameMatch && roleMatch
    })
  })

  const uniqueRoles = computed(() => {
    if (!employees.value) return []

    const roles = new Set<string>()
    employees.value.forEach(emp => roles.add(emp.role))
    return Array.from(roles)
  })

  async function fetchEmployees() {
    isLoading.value = true
    error.value = null
    try {
      employees.value = await api.fetchEmployees()
    } catch (err) {
      error.value = 'Falha ao buscar os funcionários'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function getEmployeeById(id: string): Promise<Employee | undefined> {
    try {
      return await api.fetchEmployeeById(id)
    } catch (err) {
      error.value = 'Falha ao buscar o funcionário'
      throw err
    }
  }

  async function addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    try {
      const newEmployee = await api.createEmployee(employee)
      employees.value = [...employees.value, newEmployee]
      return newEmployee
    } catch (err) {
      error.value = 'Falha ao adicionar o funcionário'
      throw err
    }
  }

  async function updateEmployee(id: string, updatedEmployee: Omit<Employee, 'id'>): Promise<Employee | null> {
    try {
      const employee = await api.updateEmployee(id, updatedEmployee)
      const index = employees.value.findIndex(emp => emp.id === id)
      if (index !== -1) {
        employees.value = [
          ...employees.value.slice(0, index),
          employee,
          ...employees.value.slice(index + 1)
        ]
      }
      return employee
    } catch (err) {
      error.value = 'Falha ao atualizar o funcionário'
      throw err
    }
  }

  async function deleteEmployee(id: string): Promise<boolean> {
    try {
      await api.deleteEmployee(id)
      employees.value = employees.value.filter(emp => emp.id !== id)
      return true
    } catch (err) {
      error.value = 'Falha ao excluir o funcionário'
      throw err
    }
  }

  function setNameFilter(filter: string) {
    nameFilter.value = filter
  }

  function setRoleFilter(filter: string) {
    roleFilter.value = filter
  }

  function clearFilters() {
    nameFilter.value = ''
    roleFilter.value = ''
  }

  return {
    employees,
    filteredEmployees,
    uniqueRoles,
    nameFilter,
    roleFilter,
    isLoading,
    error,
    fetchEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    setNameFilter,
    setRoleFilter,
    clearFilters
  }
})