<script lang="ts" setup>
import VerifySignatureComponent from '@/components/VerifySignatureComponent.vue'
</script>

<template>
  <h1 class="text-2xl py-6">Verify PGP Message</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <VerifySignatureComponent />
  </div>
</template>
