export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Employee {
  id: string
  name: string
  address: string
  neighborhood?: string
  zipCode?: string
  phone?: string
  role: string
  salary: number
  contractDate: string
  ownerId: string
  createdAt?: string
  updatedAt?: string
}