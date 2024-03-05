<script lang="ts" setup>
import { ref } from 'vue'
import RevokeKeyPairComponent from '@/components/RevokeKeyPairComponent.vue'

const revokedKey = ref<string>('')

function onRevoked(publicKey: string) {
  revokedKey.value = publicKey
}
</script>

<template>
  <h1 class="text-2xl py-6">Revoke PGP Key</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <RevokeKeyPairComponent @revoked="onRevoked" />
    <div
      class="card bg-neutral text-neutral-content shadow-xl"
      v-if="revokedKey && typeof revokedKey === 'string'"
    >
      <div class="card-body">
        <h3 class="card-title">Revoked Key</h3>
        <pre class="select-all overflow-scroll" v-text="revokedKey"></pre>
      </div>
    </div>
  </div>
</template>
