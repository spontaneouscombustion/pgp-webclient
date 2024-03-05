<script lang="ts" setup>
import { generateKey, type EllipticCurveName, type SerializedKeyPair } from 'openpgp'
import { ref } from 'vue'

const emit = defineEmits<{
  generate: [
    keypair: SerializedKeyPair<string> & {
      revocationCertificate?: string
    }
  ]
}>()

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
  B2048 = 2048,
  B4096 = 4096,
  B8192 = 8192
}

const identities = ref<{ name: string; email: string }[]>([
  {
    name: '',
    email: ''
  }
])
const password = ref<string>('')
const curve = ref<EllipticCurveName>(CurveName.CURVE25519)
const keyFormat = ref<PGPKeyFormat>(PGPKeyFormat.ARMORED)
const keyType = ref<PGPKeyType>(PGPKeyType.ECC)
const rsaBits = ref<RSAKeySize>(RSAKeySize.B4096)
const keyTtl = ref<KeyTTL>(KeyTTL.YEAR)

async function generate() {
  if (keyType.value === PGPKeyType.ECC) {
    const kp = await generateKey({
      type: PGPKeyType.ECC,
      curve: curve.value,
      format: PGPKeyFormat.ARMORED,
      userIDs: identities.value,
      passphrase: password.value,
      keyExpirationTime: keyTtl.value
    })
    emit('generate', kp)
  } else if (keyType.value === PGPKeyType.RSA) {
    const kp = await generateKey({
      type: PGPKeyType.RSA,
      rsaBits: rsaBits.value,
      format: PGPKeyFormat.ARMORED,
      userIDs: identities.value,
      passphrase: password.value,
      keyExpirationTime: keyTtl.value
    })
    emit('generate', kp)
  } else {
    alert('Invalid Key Type!')
  }
}
</script>
<template>
  <form class="flex flex-col gap-3" @submit.prevent="generate" action="/">
    <div v-for="(identity, index) in identities" :key="index" class="flex flex-row gap-2 items-end">
      <div class="flex-grow grid grid-cols-2 gap-2">
        <div class="form-control">
          <label for="name">
            <span class="label-text">Name</span>
          </label>
          <input
            id="name"
            class="input input-bordered"
            type="text"
            v-model="identities[index].name"
            required
          />
        </div>
        <div class="form-control">
          <label for="email">
            <span class="label-text">Email</span>
          </label>
          <input
            id="email"
            class="input input-bordered"
            type="email"
            v-model="identities[index].email"
            required
          />
        </div>
      </div>
      <button
        v-if="identities.length > 1"
        class="btn btn-ghost"
        type="button"
        @click="() => identities.splice(index, 1)"
        tabindex="-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="fill-current size-5" viewBox="0 0 16 16">
          <path
            d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
          />
        </svg>
      </button>
    </div>
    <button
      type="button"
      class="btn btn-bordered btn-block btn-xs"
      @click="identities.push({ name: '', email: '' })"
    >
      Add Identity
    </button>
    <div class="form-control">
      <label class="label" for="password">
        <span class="label-text">Password</span>
      </label>
      <input id="password" class="input input-bordered" type="password" v-model="password" />
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="form-control">
        <label class="label" for="keyType">
          <span class="label-text">Type</span>
        </label>
        <select id="keyType" class="select select-bordered w-full" v-model="keyType">
          <option :value="PGPKeyType.ECC" v-text="PGPKeyType.ECC"></option>
          <option :value="PGPKeyType.RSA" v-text="PGPKeyType.RSA"></option>
        </select>
      </div>
      <template v-if="keyType === PGPKeyType.ECC">
        <div class="form-control">
          <label class="label" for="keyFormat">
            <span class="label-text">Format</span>
          </label>
          <select id="keyFormat" class="select select-bordered w-full" v-model="keyFormat">
            <option :value="PGPKeyFormat.ARMORED" v-text="PGPKeyFormat.ARMORED"></option>
            <option :value="PGPKeyFormat.BINARY" v-text="PGPKeyFormat.BINARY" disabled></option>
            <option :value="PGPKeyFormat.OBJECT" v-text="PGPKeyFormat.OBJECT" disabled></option>
          </select>
        </div>
        <div class="form-control">
          <label class="label" for="curve">
            <span class="label-text">Curve</span>
          </label>
          <select id="curve" class="select select-bordered w-full" v-model="curve">
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
      </template>
      <template v-else-if="keyType === PGPKeyType.RSA">
        <div class="form-control">
          <label class="label" for="rsaBits">
            <span class="label-text">RSA Size</span>
          </label>
          <select id="rsaBits" class="select select-bordered w-full" v-model="rsaBits">
            <option :value="RSAKeySize.B2048">{{ RSAKeySize.B2048 }} Bits</option>
            <option :value="RSAKeySize.B4096">{{ RSAKeySize.B4096 }} Bits</option>
            <option :value="RSAKeySize.B8192">{{ RSAKeySize.B8192 }} Bits</option>
          </select>
        </div>
      </template>
      <template v-else>Invalid Key type</template>
      <div class="form-control">
        <label class="label" for="keyTtl">
          <span class="label-text">Key TTL</span>
        </label>
        <select id="keyTtl" class="select select-bordered w-full" v-model="keyTtl">
          <option :value="KeyTTL.DAY">1 Day</option>
          <option :value="KeyTTL.WEEK">1 Week</option>
          <option :value="KeyTTL.MONTH">1 Month</option>
          <option :value="KeyTTL.MONTH6">6 Months</option>
          <option :value="KeyTTL.YEAR">1 Year</option>
          <option :value="KeyTTL.NO_EXPIRATION">No Expiration</option>
        </select>
      </div>
    </div>
    <div class="grid md:flex md:justify-end">
      <button class="btn btn-primary" type="submit">Generate</button>
    </div>
  </form>
</template>
