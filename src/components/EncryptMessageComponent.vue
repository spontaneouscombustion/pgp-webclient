<script lang="ts" setup>
import {
  decryptKey,
  encrypt,
  readKey,
  readPrivateKey,
  createMessage,
  type EncryptOptions,
  type MaybeStream,
  type Message,
  type Data,
  type WebStream,
  type NodeStream
} from 'openpgp'
import { ref } from 'vue'

const textmessage = ref<string>('')
const textmessagepassword = ref<string>('')
const recipientPubKey = ref<string>('')
const senderPrivKey = ref<string>('')
const senderPrivKeyPassword = ref<string>('')
const encryptedText = ref<string | WebStream<string> | NodeStream<string>>('')

async function doEncrypt() {
  encryptedText.value = ''
  try {
    const pubkey = await readKey({
      armoredKey: recipientPubKey.value
    })

    let encryptOptions: EncryptOptions & {
      message: Message<MaybeStream<Data>>
      format?: 'armored' | undefined
    } = {
      message: await createMessage({ text: textmessage.value }),
      encryptionKeys: pubkey
    }

    if (senderPrivKey.value) {
      encryptOptions = {
        ...encryptOptions,
        signingKeys: await decryptKey({
          privateKey: await readPrivateKey({ armoredKey: senderPrivKey.value }),
          passphrase: senderPrivKeyPassword.value
        })
      }
    }

    if (textmessagepassword.value) {
      encryptOptions = {
        ...encryptOptions,
        passwords: [textmessagepassword.value]
      }
    }

    encryptedText.value = await encrypt(encryptOptions)
  } catch (e) {
    console.log(e)
    if (e instanceof Error) {
      alert(e.message)
    }
  }
}
</script>

<template>
  <h1>Encrypt Message</h1>
  <form action="/" @submit.prevent="doEncrypt">
    <div>
      <label>Message</label>
      <textarea v-model="textmessage" required></textarea>
    </div>
    <div>
      <label>Message Password</label>
      <input v-model="textmessagepassword" type="password" />
    </div>
    <div>
      <label>Recipient Public Key</label>
      <textarea v-model="recipientPubKey" required></textarea>
    </div>
    <div>
      <label>Your Private Key</label>
      <textarea v-model="senderPrivKey"></textarea>
    </div>
    <div>
      <label>Private Key Password</label>
      <input v-model="senderPrivKeyPassword" type="password" />
    </div>
    <div>
      <button type="submit">Encrypt Message</button>
    </div>
  </form>
  <div v-if="encryptedText && typeof encryptedText === 'string'">
    <pre v-text="encryptedText"></pre>
  </div>
</template>
