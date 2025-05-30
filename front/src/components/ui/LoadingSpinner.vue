<template>
  <div class="flex justify-center items-center">
    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
    <span v-if="message" class="ml-2">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>()
</script>