<script lang="ts" setup>
import SignMessageComponent from '@/components/SignMessageComponent.vue'
import { type WebStream } from 'openpgp'
import { ref } from 'vue'
const result = ref<string | WebStream<string>>()
</script>
<template>
  <h1 class="text-2xl py-6">Sign Message</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <SignMessageComponent @signed="(data) => (result = data)" />
    <div v-if="result" class="card bg-neutral text-neutral-content shadow-xl">
      <div class="card-body">
        <h3 class="card-title">Signed Message</h3>
        <pre
          class="select-all overflow-scroll"
          v-if="typeof result === 'string'"
          v-text="result"
        ></pre>
      </div>
    </div>
  </div>
</template>
