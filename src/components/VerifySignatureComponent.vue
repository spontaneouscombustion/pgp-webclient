<script setup lang="ts">
import { createMessage, readKey, readSignature, verify } from 'openpgp'
import { ref } from 'vue'

const message = ref<string>('')
const signature = ref<string>('')
const publicKey = ref<string>('')
const signedBy = ref<string>('')

// async function verifySig(armoredSig: string, armoredPkey: string) {
//   const sig = await readCleartextMessage({
//     cleartextMessage: armoredSig
//   })
//   const pkey = await readKey({
//     armoredKey: armoredPkey
//   })

//   return await verify({
//     message: sig,
//     verificationKeys: pkey
//   })
// }

async function verifyDetachedSig(text: string, armoredSig: string, armoredPkey: string) {
  const textmessage = await createMessage({
    text
  })

  const pkey = await readKey({
    armoredKey: armoredPkey
  })

  const asignature = await readSignature({
    armoredSignature: armoredSig
  })

  return await verify({
    message: textmessage,
    signature: asignature,
    verificationKeys: pkey
  })
}

async function check(): Promise<void> {
  signedBy.value = ''
  const result = await verifyDetachedSig(message.value, signature.value, publicKey.value)
  const { verified, keyID } = result.signatures[0]
  try {
    await verified // throws on invalid signature
    signedBy.value = keyID.toHex()
  } catch (e) {
    console.log(e)
    alert('Signature could not be verified!')
  }
}
</script>

<template>
  <div>
    <h1>Verify Message</h1>
    <form action="/" @submit.prevent="check">
      <div>
        <label>Message</label>
        <textarea v-model="message" required></textarea>
      </div>
      <div>
        <label>Signature</label>
        <textarea v-model="signature" required></textarea>
      </div>
      <div>
        <label>Public Key</label>
        <textarea v-model="publicKey" required></textarea>
      </div>
      <div>
        <button type="submit">Check</button>
      </div>
    </form>
    <div v-if="signedBy">
      <h4>Message Verified</h4>
      <p>Signed using Key ID: {{ signedBy }}</p>
    </div>
  </div>
</template>