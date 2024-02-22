<script lang="ts" setup>
import { generateKey, type EllipticCurveName } from 'openpgp'
import { ref, reactive } from 'vue'

enum CurveName {
  ED25519 = 'ed25519',
  CURVE25519 = 'curve25519',
  P256 = 'p256',
  P384 = 'p384',
  P251 = 'p251',
  SECP256K1 = 'secp256k1',
  BRAINPOOLP256R1 = 'brainpoolP256r1',
  BRAINPOOLP384R1 = 'brainpoolP384r1',
  BRAINPOOLP512R1 = 'brainpoolP512r1'
}

enum KeyTTL {
  DAY = 86400,
  WEEK = 604800,
  MONTH = 2592000,
  MONTH6 = 15724800,
  YEAR = 31449600,
  NO_EXPIRATION = 0
}

//'ed25519' | 'curve25519' | 'p256' | 'p384' | 'p521' | 'secp256k1' | 'brainpoolP256r1' | 'brainpoolP384r1' | 'brainpoolP512r1'

enum PGPKeyType {
  ECC = 'ecc',
  RSA = 'rsa'
}

enum PGPKeyFormat {
  OBJECT = 'object',
  BINARY = 'binary',
  ARMORED = 'armored'
}

enum RSAKeySize {
  B1024 = 1024,
  B2048 = 2048,
  B4096 = 4096,
  B8192 = 8192
}

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const curve = ref<EllipticCurveName>(CurveName.CURVE25519)
const keyFormat = ref<PGPKeyFormat>(PGPKeyFormat.ARMORED)
const keyType = ref<PGPKeyType>(PGPKeyType.ECC)
const rsaBits = ref<RSAKeySize>(RSAKeySize.B4096)
const keyTtl = ref<KeyTTL>(KeyTTL.YEAR)

const result = reactive<{
  publicKey: string
  privateKey: string
  revocationCertificate?: string
}>({
  publicKey: '',
  privateKey: '',
  revocationCertificate: ''
})

async function generate() {
  if (keyType.value === PGPKeyType.ECC) {
    const { privateKey, publicKey, revocationCertificate } = await generateKey({
      type: PGPKeyType.ECC,
      curve: curve.value,
      format: PGPKeyFormat.ARMORED,
      userIDs: [
        {
          name: name.value,
          email: email.value
        }
      ],
      passphrase: password.value,
      keyExpirationTime: keyTtl.value
    })
    result.publicKey = publicKey
    result.privateKey = privateKey
    result.revocationCertificate = revocationCertificate
  } else if (keyType.value === PGPKeyType.RSA) {
    const { privateKey, publicKey } = await generateKey({
      type: PGPKeyType.RSA,
      rsaBits: rsaBits.value,
      userIDs: [
        {
          name: name.value,
          email: email.value
        }
      ],
      passphrase: password.value,
      keyExpirationTime: keyTtl.value
    })
    result.publicKey = publicKey
    result.privateKey = privateKey
  } else {
    alert('Invalid Key Type!')
  }
}
</script>
<template>
  <h1>Key Pair Generator</h1>
  <form @submit.prevent="generate" action="/">
    <div>
      <label for="">Name</label>
      <input type="text" v-model="name" required />
    </div>
    <div>
      <label for="">Email</label>
      <input type="email" v-model="email" required />
    </div>
    <div>
      <label for="">Password</label>
      <input type="password" v-model="password" />
    </div>

    <div>
      <label for="">Key Type</label>
      <select v-model="keyType">
        <option :value="PGPKeyType.ECC" v-text="PGPKeyType.ECC"></option>
        <option :value="PGPKeyType.RSA" v-text="PGPKeyType.RSA"></option>
      </select>
    </div>
    <div v-if="keyType === PGPKeyType.ECC">
      <div>
        <label for="">Format</label>
        <select v-model="keyFormat">
          <option :value="PGPKeyFormat.ARMORED" v-text="PGPKeyFormat.ARMORED"></option>
          <option :value="PGPKeyFormat.BINARY" v-text="PGPKeyFormat.BINARY"></option>
          <option :value="PGPKeyFormat.OBJECT" v-text="PGPKeyFormat.OBJECT"></option>
        </select>
      </div>
      <div>
        <label for="">Curve</label>
        <select v-model="curve">
          <option :value="CurveName.ED25519" v-text="CurveName.ED25519"></option>
          <option :value="CurveName.CURVE25519" v-text="CurveName.CURVE25519"></option>
          <option :value="CurveName.P251" v-text="CurveName.P251"></option>
          <option :value="CurveName.P256" v-text="CurveName.P256"></option>
          <option :value="CurveName.P384" v-text="CurveName.P384"></option>
          <option :value="CurveName.SECP256K1" v-text="CurveName.SECP256K1"></option>
          <option :value="CurveName.BRAINPOOLP256R1" v-text="CurveName.BRAINPOOLP256R1"></option>
          <option :value="CurveName.BRAINPOOLP384R1" v-text="CurveName.BRAINPOOLP384R1"></option>
          <option :value="CurveName.BRAINPOOLP512R1" v-text="CurveName.BRAINPOOLP512R1"></option>
        </select>
      </div>
    </div>
    <div v-else-if="keyType === PGPKeyType.RSA">
      <div>
        <label>RSA Size</label>
        <select v-model="rsaBits">
          <option :value="RSAKeySize.B1024">{{ RSAKeySize.B1024 }} Bits</option>
          <option :value="RSAKeySize.B2048">{{ RSAKeySize.B2048 }} Bits</option>
          <option :value="RSAKeySize.B4096">{{ RSAKeySize.B4096 }} Bits</option>
          <option :value="RSAKeySize.B8192">{{ RSAKeySize.B8192 }} Bits</option>
        </select>
      </div>
    </div>
    <div v-else>Invalid Key type</div>
    <div>
      <label>Key TTL</label>
      <select v-model="keyTtl">
        <option :value="KeyTTL.DAY">1 Day</option>
        <option :value="KeyTTL.WEEK">1 Week</option>
        <option :value="KeyTTL.MONTH">1 Month</option>
        <option :value="KeyTTL.MONTH6">6 Months</option>
        <option :value="KeyTTL.YEAR">1 Year</option>
        <option :value="KeyTTL.NO_EXPIRATION">No Expiration</option>
      </select>
    </div>
    <div>
      <button type="submit">Generate</button>
    </div>
  </form>
  <div v-if="result.publicKey">
    Public Key
    <pre v-text="result.publicKey"></pre>
  </div>
  <div v-if="result.privateKey">
    Private Key
    <pre v-text="result.privateKey"></pre>
  </div>
  <div v-if="result.revocationCertificate">
    Revocation Certificate
    <pre v-text="result.revocationCertificate"></pre>
  </div>
</template>
