import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  hireDate: string;
  salary: number;
}

export const useEmployeeStore = defineStore('employees', () => {
  // Mock employee data
  const employees = ref<Employee[]>([
    {
      id: '1',
      name: 'João da Silva',
      email: 'joao.silva@examplo.com',
      role: 'Desenvolvedor',
      department: 'Engenharia',
      hireDate: '2022-01-15',
      salary: 85000
    },
    {
      id: '2',
      name: 'Maria da Silva',
      email: 'maria.silva@examplo.com',
      role: 'Designer',
      department: 'Design',
      hireDate: '2021-06-22',
      salary: 78000
    },
    {
      id: '3',
      name: 'Roberto Firmino',
      email: 'roberto.firmino@examplo.com',
      role: 'Gerente',
      department: 'Engenharia',
      hireDate: '2020-03-10',
      salary: 110000
    },
    {
      id: '4',
      name: 'Emilia Costa',
      email: 'emily.costa@examplo.com',
      role: 'Desenvolvedor',
      department: 'Engenharia',
      hireDate: '2022-09-05',
      salary: 82000
    },
    {
      id: '5',
      name: 'Michel De Souza',
      email: 'michael.souza@examplo.com',
      role: 'Gerente de Produtos',
      department: 'Produtos',
      hireDate: '2021-11-18',
      salary: 95000
    }
  ])
  
  const nameFilter = ref('')
  const roleFilter = ref('')

  const filteredEmployees = computed(() => {
    return employees.value.filter(employee => {
      const nameMatch = employee.name.toLowerCase().includes(nameFilter.value.toLowerCase())
      const roleMatch = roleFilter.value === '' || employee.role.toLowerCase() === roleFilter.value.toLowerCase()
      return nameMatch && roleMatch
    })
  })

  const uniqueRoles = computed(() => {
    const roles = new Set<string>()
    employees.value.forEach(emp => roles.add(emp.role))
    return Array.from(roles)
  })

  function getEmployeeById(id: string): Employee | undefined {
    return employees.value.find(emp => emp.id === id)
  }

  function addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const newEmployee = {
      ...employee,
      id: crypto.randomUUID()
    }
    employees.value.push(newEmployee)
    return newEmployee
  }

  function updateEmployee(id: string, updatedEmployee: Omit<Employee, 'id'>): Employee | null {
    const index = employees.value.findIndex(emp => emp.id === id)
    if (index !== -1) {
      const employee = { ...updatedEmployee, id }
      employees.value[index] = employee
      return employee
    }
    return null
  }

  function deleteEmployee(id: string): boolean {
    const initialLength = employees.value.length
    employees.value = employees.value.filter(emp => emp.id !== id)
    return employees.value.length !== initialLength
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
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    setNameFilter,
    setRoleFilter,
    clearFilters
  }
})