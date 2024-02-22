<script lang="ts" setup>
import { readPrivateKey, decryptKey, revokeKey, readKey } from 'openpgp'
import { ref } from 'vue'

const privateKey = ref<string>('')
const password = ref<string>('')
const revokeCert = ref<string>('')
const revokedKey = ref<string>('')
const publicKey = ref<string>('')

async function doRevokeByPrivateKey() {
  revokedKey.value = ''

  try {
    const privkey = await decryptKey({
      privateKey: await readPrivateKey({
        armoredKey: privateKey.value
      }),
      passphrase: password.value
    })

    const { publicKey: revKey } = await revokeKey({
      key: privkey,
      format: 'armored'
    })

    revokedKey.value = revKey
  } catch (e) {
    console.log(e)
    if (e instanceof Error) {
      alert(e.message)
    }
  }
}

async function doRevokeByRevocationCert() {
  revokedKey.value = ''

  try {
    const { publicKey: revKey } = await revokeKey({
      key: await readKey({ armoredKey: publicKey.value }),
      revocationCertificate: revokeCert.value,
      format: 'armored'
    })

    revokedKey.value = revKey
  } catch (e) {
    console.log(e)
    if (e instanceof Error) {
      alert(e.message)
    }
  }
}
</script>

<template>
  <h1>Revoke Key</h1>
  <form action="/" @submit.prevent="doRevokeByPrivateKey">
    <div>
      <label>Private Key</label>
      <textarea v-model="privateKey"></textarea>
    </div>
    <div>
      <label>Private Key Password</label>
      <input type="password" v-model="password" />
    </div>
    <div>
      <button type="submit">Revoke by Private Key</button>
    </div>
  </form>
  <form action="/" @submit.prevent="doRevokeByRevocationCert">
    <div>
      <label>Revocation Certificate</label>
      <textarea v-model="revokeCert"></textarea>
    </div>
    <div>
      <label>Public Key</label>
      <textarea v-model="publicKey"></textarea>
    </div>
    <div>
      <button type="submit">Revoke by Revocation Certificate</button>
    </div>
  </form>
  <div v-if="revokedKey">
    <h4>Revoked successfully!</h4>
    <pre v-text="revokedKey"></pre>
  </div>
</template>
