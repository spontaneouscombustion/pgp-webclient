<script lang="ts" setup>
import { createCleartextMessage, sign, type NodeStream, type WebStream } from 'openpgp'
import { ref, inject } from 'vue'
import { privateKeySymbol } from '@/keys'
import ImportKeyComponent from '@/components/ImportKeyComponent.vue'

const textMessage = ref<string>('')
const injected = inject(privateKeySymbol)

const emit = defineEmits<{
  signed: [data: string | WebStream<string> | NodeStream<string>]
}>()

async function doSign() {
  try {
    const privkey = injected?.privateKey.value
    const unsignedMessage = await createCleartextMessage({
      text: textMessage.value
    })
    if (!privkey) {
      const drawerElement = document.getElementById('privkey-drawer') as HTMLInputElement
      drawerElement.checked = true
      return
    }
    emit(
      'signed',
      await sign({
        message: unsignedMessage,
        signingKeys: privkey
      })
    )
  } catch (e) {
    console.log(e)
    if (e instanceof Error) {
      alert(e.message)
    }
  }
}
</script>

<template>
  <form class="grid grid-cols-1 gap-3" action="/" @submit.prevent="doSign">
    <ImportKeyComponent v-model="textMessage" label="Message" :required="true" />
    <div class="grid md:flex md:justify-end">
      <button class="btn btn-primary" type="submit">Sign</button>
    </div>
  </form>
</template>
