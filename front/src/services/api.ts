import type { Employee, User, LoginCredentials, RegisterData, AuthResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

export async function registerUser(userData: RegisterData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Falha ao registrar usuário')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    throw error
  }
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Falha ao fazer login')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    throw error
  }
}

export async function fetchUserProfile(): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: createAuthHeaders(),
    })

    if (!response.ok) throw new Error('Falha ao buscar perfil do usuário')
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error)
    throw error
  }
}

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      headers: createAuthHeaders(),
    })

    if (!response.ok) throw new Error('Falha ao buscar os funcionários')
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar os funcionários:', error)
    throw error
  }
}

export async function fetchEmployeeById(id: string): Promise<Employee> {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      headers: createAuthHeaders(),
    })

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
      headers: createAuthHeaders(),
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
      headers: createAuthHeaders(),
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
      headers: createAuthHeaders(),
    })
    
    if (!response.ok) throw new Error('Falha ao excluir o funcionário')
  } catch (error) {
    console.error('Erro ao excluir o funcionário:', error)
    throw error
  }
}