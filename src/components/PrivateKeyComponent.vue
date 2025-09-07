<script lang="ts" setup>
import { decryptKey, readPrivateKey } from 'openpgp'
import ImportKeyComponent from './ImportKeyComponent.vue'
import { ref, inject } from 'vue'
import { privateKeySymbol } from '@/keys'

const privateKeyStr = ref<string>('')
const password = ref<string>('')

const injected = inject(privateKeySymbol)

async function save() {
  try {
    const key = await decryptKey({
      privateKey: await readPrivateKey({
        armoredKey: privateKeyStr.value
      }),
      passphrase: password.value
    })

    injected?.updatePrivateKey(key)
    alert('Private key saved!')

    const drawerElement = document.getElementById('privkey-drawer') as HTMLInputElement
    drawerElement.checked = false
  } catch (e) {
    console.log(e)
    if (e instanceof Error) {
      alert(e.message)
    }
  }
}
</script>

<template>
  <form class="grid grid-cols-1 gap-2" method="POST" action="/" @submit.prevent="save">
    <ImportKeyComponent placeholder="Please enter your Private key" v-model="privateKeyStr" />
    <fieldset class="fieldset">
      <label class="label" for="privPwd">
        Private Key Password
      </label>
      <input id="privPwd" class="input" v-model="password" type="password" />
    </fieldset>
    <button type="submit" class="btn btn-accent btn-block">Save</button>
  </form>
</template>
