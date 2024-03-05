<script lang="ts" setup>
import { readKey, revokeKey } from 'openpgp'
import ImportKeyComponent from './ImportKeyComponent.vue'
import { reactive } from 'vue'

const emit = defineEmits<{
  (e: 'revoked', key: string): void
}>()

const form = reactive<{
  certificate: string
  publicKey: string
}>({
  certificate: '',
  publicKey: ''
})

async function doRevoke(): Promise<void> {
  try {
    const { publicKey } = await revokeKey({
      key: await readKey({ armoredKey: form.publicKey }),
      revocationCertificate: form.certificate,
      format: 'armored'
    })
    emit('revoked', publicKey)
  } catch (err) {
    console.log(err)
    if (err instanceof Error) {
      alert(err.message)
    }
  }
}
</script>

<template>
  <form class="flex flex-col gap-3" action="/" @submit.prevent="doRevoke">
    <ImportKeyComponent
      label="Revocation Certificate"
      v-model="form.certificate"
      :required="true"
    />
    <ImportKeyComponent label="Public Key" v-model="form.publicKey" :required="true" />
    <div class="grid md:flex md:justify-end">
      <button type="submit" class="btn btn-primary">Revoke</button>
    </div>
  </form>
</template>
