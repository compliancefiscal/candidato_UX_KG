import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'
import EmployeeList from '../views/Employees/EmployeeList.vue'
import EmployeeCreate from '../views/Employees/EmployeeCreate.vue'
import EmployeeEdit from '../views/Employees/EmployeeEdit.vue'

const routes = [
  {
    path: '/',
    redirect: '/employees'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/employees',
    name: 'EmployeeList',
    component: EmployeeList,
    meta: { requiresAuth: true }
  },
  {
    path: '/employees/create',
    name: 'EmployeeCreate',
    component: EmployeeCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/employees/:id/edit',
    name: 'EmployeeEdit',
    component: EmployeeEdit,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (!requiresAuth && authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    next('/employees')
  } else {
    next()
  }
})

export default router