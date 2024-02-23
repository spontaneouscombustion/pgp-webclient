<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink :to="{ name: 'generate' }">Generate</RouterLink>
      <RouterLink :to="{ name: 'encrypt' }">Encrypt</RouterLink>
      <RouterLink :to="{ name: 'decrypt' }">Decrypt</RouterLink>
      <RouterLink :to="{ name: 'sign' }">Sign</RouterLink>
      <RouterLink :to="{ name: 'verify' }">Verify</RouterLink>
      <RouterLink :to="{ name: 'revoke' }">Revoke</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>
