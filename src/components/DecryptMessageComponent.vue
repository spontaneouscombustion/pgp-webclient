<script lang="ts" setup>
import {
  decrypt,
  readMessage,
  readKey,
  type DecryptOptions,
  type Message,
  type VerificationResult,
  type MaybeStream,
  type Data
} from 'openpgp'
import { ref, inject } from 'vue'
import ImportKeyComponent from './ImportKeyComponent.vue'
import { privateKeySymbol } from '@/keys'

const encryptedMessage = ref<string>('')
const publicKey = ref<string>('')
const injected = inject(privateKeySymbol)

const emit = defineEmits<{
  decrypt: [data: MaybeStream<Data>, signature: VerificationResult[]]
}>()

async function doDecrypt() {
  try {
    const message = await readMessage({
      armoredMessage: encryptedMessage.value
    })

    if (!injected?.privateKey || !injected.privateKey.value) {
      const drawerElement = document.getElementById('privkey-drawer') as HTMLInputElement
      drawerElement.checked = true
      return
    }

    let decryptOptions: DecryptOptions & {
      message: Message<string>
    } = {
      message,
      decryptionKeys: injected.privateKey.value
    }

    if (publicKey.value) {
      decryptOptions = {
        ...decryptOptions,
        verificationKeys: await readKey({ armoredKey: publicKey.value })
      }
    }

    const { data, signatures } = await decrypt(decryptOptions)

    emit('decrypt', data, signatures)

    // result.value = data

    // await signatures[0].verified
  } catch (e) {
    console.log(e)
    if (e instanceof Error) {
      alert(e.message)
    }
  }
}
</script>

<template>
  <form class="grid grid-cols-1 gap-3" action="/" @submit.prevent="doDecrypt">
    <ImportKeyComponent
      placeholder="PGP Encrypted Message"
      v-model="encryptedMessage"
      :required="true"
    />
    <ImportKeyComponent placeholder="Signer Public Key" v-model="publicKey" />
    <div class="grid md:flex md:justify-end">
      <button class="btn btn-primary" type="submit">Decrypt</button>
    </div>
  </form>
</template>
