<script lang="ts" setup>
import DecryptMessageComponent from '@/components/DecryptMessageComponent.vue'
import { type MaybeStream } from 'openpgp'
import { ref } from 'vue'

const data = ref<MaybeStream<String>>()

function onDecrypt(d: MaybeStream<String>) {
  data.value = d
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
