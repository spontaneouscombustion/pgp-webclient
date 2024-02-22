<script lang="ts" setup>
import {
  createCleartextMessage,
  decryptKey,
  readPrivateKey,
  sign,
  type NodeStream,
  type WebStream
} from 'openpgp'
import { ref } from 'vue'

const textMessage = ref<string>('')
const armoredPkey = ref<string>('')
const password = ref<string>('')
const result = ref<string | WebStream<string> | NodeStream<string>>('')

async function doSign() {
  result.value = ''
  try {
    const privkey = await decryptKey({
      privateKey: await readPrivateKey({
        armoredKey: armoredPkey.value
      }),
      passphrase: password.value
    })
    const unsignedMessage = await createCleartextMessage({
      text: textMessage.value
    })
    result.value = await sign({
      message: unsignedMessage,
      signingKeys: privkey
    })
  } catch (e) {
    console.log(e)
    if (e instanceof Error) {
      alert(e.message)
    }
  }
}
</script>

<template>
  <h1>Sign Message</h1>
  <form action="/" @submit.prevent="doSign">
    <div>
      <label>Your Message</label>
      <textarea v-model="textMessage" required></textarea>
    </div>
    <div>
      <label>Private Key</label>
      <textarea v-model="armoredPkey" required></textarea>
    </div>
    <div>
      <label>Password</label>
      <input v-model="password" type="password" />
    </div>
    <div>
      <button type="submit">Sign</button>
    </div>
  </form>
  <div v-if="result && typeof result === 'string'">
    <pre v-text="result"></pre>
  </div>
</template>
