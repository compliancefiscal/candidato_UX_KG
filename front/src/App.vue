<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from './components/ui/Toast.vue'
</script>

<template>
  <div class="app">
    <Toast />
    <RouterView />
  </div>
</template>