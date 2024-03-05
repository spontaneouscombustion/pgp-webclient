<script lang="ts" setup>
import type { WebStream, NodeStream } from 'openpgp'
import { ref } from 'vue'
import EncryptMessageComponent from '@/components/EncryptMessageComponent.vue'
const encryptedText = ref<string | WebStream<string> | NodeStream<string>>()
</script>

<template>
  <h1 class="text-2xl py-6">Encrypt Message</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <EncryptMessageComponent @encrypt="(value) => (encryptedText = value)" />
    <div
      class="card bg-neutral text-neutral-content shadow-xl"
      v-if="encryptedText && typeof encryptedText === 'string'"
    >
      <div class="card-body">
        <h3 class="card-title">Encrypted Message</h3>
        <pre class="select-all overflow-scroll" v-text="encryptedText"></pre>
      </div>
    </div>
  </div>
</template>
