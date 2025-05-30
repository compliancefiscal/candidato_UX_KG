import type { Employee } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`)
    if (!response.ok) throw new Error('Falha ao buscar os funcionários')
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar os funcionários:', error)
    throw error
  }
}

export async function fetchEmployeeById(id: string): Promise<Employee> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`)
    if (!response.ok) throw new Error('Falha ao buscar o funcionário')
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar o funcionário:', error)
    throw error
  }
}

export async function createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    })
    if (!response.ok) throw new Error('Falha ao criar o funcionário')
    return await response.json()
  } catch (error) {
    console.error('Erro ao criar o funcionário:', error)
    throw error
  }
}

export async function updateEmployee(id: string, employee: Omit<Employee, 'id'>): Promise<Employee> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    })
    if (!response.ok) throw new Error('Falha ao atualizar o funcionário')
    return await response.json()
  } catch (error) {
    console.error('Erro ao atualizar o funcionário:', error)
    throw error
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Falha ao excluir o funcionário')
  } catch (error) {
    console.error('Erro ao excluir o funcionário:', error)
    throw error
  }
}