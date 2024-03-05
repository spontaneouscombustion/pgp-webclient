<script lang="ts" setup>
import { reactive } from 'vue'
import { readPrivateKey, decryptKey, revokeKey } from 'openpgp'
import ImportKeyComponent from '@/components/ImportKeyComponent.vue'

const form = reactive<{
  privateKey: string
  password: string
}>({
  privateKey: '',
  password: ''
})

const emit = defineEmits<{
  (e: 'revoked', key: string): void
}>()

async function doRevoke(): Promise<void> {
  try {
    const { publicKey } = await revokeKey({
      key: await decryptKey({
        privateKey: await readPrivateKey({
          armoredKey: form.privateKey
        }),
        passphrase: form.password
      }),
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
  <form class="flex flex-col gap-2" action="/" @submit.prevent="doRevoke">
    <ImportKeyComponent label="Private Key" v-model="form.privateKey" />
    <div class="form-control">
      <label class="label">
        <span class="text-label">Password</span>
      </label>
      <input type="password" class="input input-bordered" v-model="form.password" />
    </div>
    <div class="grid md:flex md:justify-end">
      <button type="submit" class="btn btn-primary">Revoke</button>
    </div>
  </form>
</template>
