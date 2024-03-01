<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavbarComponent from './components/NavbarComponent.vue';
</script>

<template>
  <NavbarComponent/>
  <div class="p-4">
    <RouterView />
  </div>
</template>
