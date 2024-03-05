<script setup lang="ts">
import { createMessage, readKey, readSignature, verify, readCleartextMessage } from 'openpgp'
import ImportKeyComponent from './ImportKeyComponent.vue'
import { ref } from 'vue'

const message = ref<string>('')
const signature = ref<string>('')
const publicKey = ref<string>('')
const signedBy = ref<string>('')

async function verifySig(armoredSig: string, armoredPkey: string) {
  const sig = await readCleartextMessage({
    cleartextMessage: armoredSig
  })
  const pkey = await readKey({
    armoredKey: armoredPkey
  })

  return await verify({
    message: sig,
    verificationKeys: pkey
  })
}

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
  try {
    if (signature.value) {
      const result = await verifyDetachedSig(message.value, signature.value, publicKey.value)
      const { verified, keyID } = result.signatures[0]
      await verified // throws on invalid signature
      signedBy.value = keyID.toHex()
    } else {
      const result = await verifySig(message.value, publicKey.value)
      const { verified, keyID } = result.signatures[0]
      await verified
      signedBy.value = keyID.toHex()
    }
  } catch (e) {
    console.log(e)
    alert('Signature could not be verified!')
  }
}
</script>

<template>
  <form class="flex flex-col gap-3" action="/" @submit.prevent="check">
    <ImportKeyComponent label="Message" v-model="message" :required="true" />
    <ImportKeyComponent label="Signature (If detached)" v-model="signature" />
    <ImportKeyComponent label="Signers Public Key" v-model="publicKey" />
    <div class="grid md:flex md:justify-end">
      <button class="btn btn-primary" type="submit">Verify</button>
    </div>
  </form>
  <div v-if="signedBy">
    <h4>Message Verified</h4>
    <p>Signed using Key ID: {{ signedBy }}</p>
  </div>
</template>
