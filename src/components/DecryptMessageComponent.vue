<script lang="ts" setup>
import {
  decrypt,
  decryptKey,
  readMessage,
  readPrivateKey,
  type DecryptOptions,
  type Message,
  readKey
} from 'openpgp'
import { ref } from 'vue'
const encryptedMessage = ref<string>('')
const privateKey = ref<string>('')
const privateKeyPassword = ref<string>('')
const publicKey = ref<string>('')
const result = ref<string>('')

async function doDecrypt() {
  result.value = ''
  try {
    const message = await readMessage({
      armoredMessage: encryptedMessage.value
    })

    const privKey = await decryptKey({
      privateKey: await readPrivateKey({
        armoredKey: privateKey.value
      }),
      passphrase: privateKeyPassword.value
    })

    let decryptOptions: DecryptOptions & {
      message: Message<string>
    } = {
      message,
      decryptionKeys: privKey
    }

    if (publicKey.value) {
      decryptOptions = {
        ...decryptOptions,
        verificationKeys: await readKey({ armoredKey: publicKey.value })
      }
    }

    const { data, signatures } = await decrypt(decryptOptions)

    result.value = data

    await signatures[0].verified
  } catch (e) {
    console.log(e)
    if (e instanceof Error) {
      alert(e.message)
    }
  }
}
</script>

<template>
  <h1>Decrypt Message</h1>
  <form action="/" @submit.prevent="doDecrypt">
    <div>
      <label>Enter PGP Encrypted Message</label>
      <textarea v-model="encryptedMessage" required></textarea>
    </div>
    <div>
      <label>Your Private Key</label>
      <textarea v-model="privateKey" required></textarea>
    </div>
    <div>
      <label>Private Key Password</label>
      <input v-model="privateKeyPassword" type="password" />
    </div>
    <div>
      <label>Signers Public Key(optional)</label>
      <textarea v-model="publicKey"></textarea>
    </div>
    <div>
      <button type="submit">Decrypt</button>
    </div>
  </form>
  <div v-if="result && typeof result === 'string'">
    <pre v-text="result"></pre>
  </div>
</template>
