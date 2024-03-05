<script lang="ts" setup>
import DecryptMessageComponent from '@/components/DecryptMessageComponent.vue'
import { type MaybeStream, type Data, type VerificationResult } from 'openpgp'
import { ref } from 'vue'

const data = ref<MaybeStream<Data>>()
const signatures = ref<VerificationResult[]>()

function onDecrypt(d: MaybeStream<Data>, s: VerificationResult[]) {
  data.value = d
  signatures.value = s
}
</script>

<template>
  <h1 class="text-2xl py-6">Decrypt Message</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <DecryptMessageComponent @decrypt="onDecrypt" />
    <div class="card bg-neutral text-neutral-content shadow-xl" v-if="data">
      <div class="card-body">
        <h3 class="card-title">Decrypted Message</h3>
        <pre class="overflow-scroll" v-text="data"></pre>
      </div>
    </div>
  </div>
</template>
