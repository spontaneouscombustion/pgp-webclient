<script lang="ts" setup>
import { type SerializedKeyPair } from 'openpgp'
import KeyPairGenerator from '@/components/KeyPairGeneratorComponent.vue'
import { ref } from 'vue'
const kp = ref<
  SerializedKeyPair<string> & {
    revocationCertificate?: string
  }
>()
</script>

<template>
  <h1 class="text-2xl py-6">Generate Key Pairs</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <KeyPairGenerator @generate="(keypair) => (kp = keypair)" />
    <div class="flex flex-col gap-2" v-if="kp">
      <div v-if="kp.publicKey" class="collapse bg-neutral text-neutral-content">
        <input type="radio" name="kp" :checked="true" />
        <div class="collapse-title text-xl font-medium">Public Key</div>
        <div class="collapse-content">
          <pre class="select-all" v-text="kp.publicKey"></pre>
        </div>
      </div>
      <div v-if="kp.privateKey" class="collapse bg-neutral text-neutral-content">
        <input type="radio" name="kp" />
        <div class="collapse-title text-xl font-medium">Private Key</div>
        <div class="collapse-content">
          <pre class="select-all" v-text="kp.privateKey"></pre>
        </div>
      </div>
      <div v-if="kp.revocationCertificate" class="collapse bg-neutral text-neutral-content">
        <input type="radio" name="kp" />
        <div class="collapse-title text-xl font-medium">Revocation Certificate</div>
        <div class="collapse-content">
          <pre class="select-all" v-text="kp.revocationCertificate"></pre>
        </div>
      </div>
    </div>
  </div>
</template>
