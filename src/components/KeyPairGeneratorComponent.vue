<script lang="ts" setup>
import {
  generateKey,
  type EllipticCurveName
  //type SerializedKeyPair
} from 'openpgp'
import { ref } from 'vue'

interface SerializedKeyPair<T extends string | Uint8Array> {
  privateKey: T
  publicKey: T
}

const emit = defineEmits<{
  generate: [
    keypair: SerializedKeyPair<string> & {
      revocationCertificate?: string
    }
  ]
}>()

enum CurveName {
  ED25519 = 'ed25519Legacy',
  CURVE25519 = 'curve25519Legacy',
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
  RSA = 'rsa',
  CURVE448 = 'curve448',
  CURVE25519 = 'curve25519'
}

enum PGPKeyFormat {
  //OBJECT = 'object',
  //BINARY = 'binary',
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
//const keyFormat = ref<PGPKeyFormat>(PGPKeyFormat.ARMORED)
const keyType = ref<PGPKeyType>(PGPKeyType.ECC)
const rsaBits = ref<RSAKeySize>(RSAKeySize.B4096)
const keyTtl = ref<KeyTTL>(KeyTTL.YEAR)
const loader = ref<boolean>(false)

async function generate() {
  loader.value = true
  try {
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
    } else if(keyType.value === PGPKeyType.CURVE448
      || keyType.value === PGPKeyType.CURVE25519
    ) {
      const kp = await generateKey({
        type: keyType.value,
        format: PGPKeyFormat.ARMORED,
        userIDs: identities.value,
        passphrase: password.value,
        keyExpirationTime: keyTtl.value 
      })
      emit('generate', kp)
    } else {
      alert('Invalid Key Type!')
    }
  } catch (e: unknown) {
    if(e instanceof Error){
      alert(e.message)
    }
    console.log(e)
  } finally {
    loader.value = false
  }
}
</script>
<template>
  <form class="flex flex-col gap-3" @submit.prevent="generate" action="/">
    <div v-for="(identity, index) in identities" :key="index" class="flex flex-row gap-2 items-end">
      <div class="grow grid grid-cols-2 gap-2">
        <div class="form-control">
          <label class="floating-label">
            <span>Name</span>
            <input
              id="name"
              class="input"
              type="text"
              placeholder="Name"
              v-model="identities[index].name"
              required
            />
          </label>
        </div>
        <div class="form-control">
          <label class="floating-label">
            <span class="label-text">Email</span>
            <input
              id="email"
              class="input"
              type="email"
              placeholder="Email"
              v-model="identities[index].email"
              required
            />
          </label>
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
      class="btn btn-block btn-xs"
      @click="identities.push({ name: '', email: '' })"
    >
      Add Identity
    </button>
    <fieldset class="fieldset">
      <label class="floating-label">
        <span>Password</span>
        <input id="password" class="input w-full" type="password" v-model="password" />
      </label>
    </fieldset>
    <div class="grid grid-cols-2 gap-2">
      <fieldset class="fieldset">
        <label class="label" for="keyType">
          Type
        </label>
        <select id="keyType" class="select" v-model="keyType">
          <option :value="PGPKeyType.ECC" v-text="PGPKeyType.ECC"></option>
          <option :value="PGPKeyType.RSA" v-text="PGPKeyType.RSA"></option>
          <option :value="PGPKeyType.CURVE448" v-text="PGPKeyType.CURVE448"></option>
          <option :value="PGPKeyType.CURVE25519" v-text="PGPKeyType.CURVE25519"></option>
        </select>
      </fieldset>
      <template v-if="keyType === PGPKeyType.ECC">
        <fieldset class="fieldset">
          <label class="label" for="curve">
            Curve
          </label>
          <select id="curve" class="select" v-model="curve">
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
        </fieldset>
      </template>
      <template v-else-if="keyType === PGPKeyType.RSA">
        <fieldset class="fieldset">
          <label class="label" for="rsaBits">
            RSA Size
          </label>
          <select id="rsaBits" class="select w-full" v-model="rsaBits">
            <option :value="RSAKeySize.B2048">{{ RSAKeySize.B2048 }} Bits</option>
            <option :value="RSAKeySize.B4096">{{ RSAKeySize.B4096 }} Bits</option>
            <option :value="RSAKeySize.B8192">{{ RSAKeySize.B8192 }} Bits</option>
          </select>
        </fieldset>
      </template>
      <template v-else-if="keyType === PGPKeyType.CURVE448 || keyType === PGPKeyType.CURVE25519">

      </template>
      <template v-else>Invalid Key type</template>
      <fieldset class="fieldset">
        <label class="label" for="keyTtl">
          Key TTL
        </label>
        <select id="keyTtl" class="select" v-model="keyTtl">
          <option :value="KeyTTL.DAY">1 Day</option>
          <option :value="KeyTTL.WEEK">1 Week</option>
          <option :value="KeyTTL.MONTH">1 Month</option>
          <option :value="KeyTTL.MONTH6">6 Months</option>
          <option :value="KeyTTL.YEAR">1 Year</option>
          <option :value="KeyTTL.NO_EXPIRATION">No Expiration</option>
        </select>
      </fieldset>
    </div>
    <div class="grid md:flex md:justify-end">
      <button class="btn btn-primary" type="submit" :disabled="loader">
        <template v-if="loader">
          Please wait.
          <span class="loading loading-spinner loading-sm"></span>
        </template>
        <template v-else> Generate </template>
      </button>
    </div>
  </form>
</template>
