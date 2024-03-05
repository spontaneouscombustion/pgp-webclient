<script setup lang="ts">
import { RouterView } from 'vue-router'
import { type PrivateKey } from 'openpgp'
import NavbarComponent from '@/components/NavbarComponent.vue'
import PrivateKeyComponent from '@/components/PrivateKeyComponent.vue'
import { provide, ref } from 'vue'
import { privateKeySymbol } from '@/keys'

const privateKeyObject = ref<PrivateKey>()

function updatePrivateKey(pkey: PrivateKey | undefined) {
  privateKeyObject.value = pkey
}

provide(privateKeySymbol, {
  privateKey: privateKeyObject,
  updatePrivateKey
})
</script>

<template>
  <div class="drawer drawer-end">
    <input id="privkey-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <NavbarComponent />
      <div class="p-4">
        <RouterView />
      </div>
    </div>
    <div class="drawer-side">
      <label for="privkey-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="p-4 w-80 min-h-full bg-base-200 text-base-content">
        <div class="text-center py-5">
          <h4 class="text-xl">Your Private Key</h4>
          <p>Certain functions requires Private Key like signing and decrypting message</p>
        </div>
        <div class="flex flex-col gap-2"><PrivateKeyComponent /></div>
      </div>
    </div>
  </div>
</template>
