<script setup lang="ts">
import { useToast } from '../../composables/useToast'

const { toasts, removeToast } = useToast()

const getToastClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-500 text-green-800'
    case 'error':
      return 'bg-red-50 border-red-500 text-red-800'
    case 'warning':
      return 'bg-yellow-50 border-yellow-500 text-yellow-800'
    case 'info':
    default:
      return 'bg-blue-50 border-blue-500 text-blue-800'
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <transition-group name="fade">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="max-w-md px-4 py-3 rounded-lg shadow-md border-l-4 flex items-start animate-fade-in"
        :class="getToastClasses(toast.type)"
      >
        <div class="flex-grow">{{ toast.message }}</div>
        <button 
          @click="removeToast(toast.id)" 
          class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &times;
        </button>
      </div>
    </transition-group>
  </div>
</template>