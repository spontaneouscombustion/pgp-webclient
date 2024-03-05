<script lang="ts" setup>
import ImportKeyComponent from './ImportKeyComponent.vue'
import {
  encrypt,
  readKey,
  createMessage,
  type EncryptOptions,
  type MaybeStream,
  type Message,
  type Data,
  type WebStream,
  type NodeStream
} from 'openpgp'
import { ref, inject } from 'vue'
import { privateKeySymbol } from '@/keys'

const emit = defineEmits<{
  encrypt: [value: string | WebStream<string> | NodeStream<string>]
}>()

const textmessage = ref<string>('')
const recipientPubKeys = ref<string[]>([''])

const injected = inject(privateKeySymbol)

async function doEncrypt() {
  try {
    const pubkeys = await Promise.all(
      recipientPubKeys.value.map(async (pk) => await readKey({ armoredKey: pk }))
    )
    const signingKeys = injected?.privateKey.value

    let encryptOptions: EncryptOptions & {
      message: Message<MaybeStream<Data>>
      format?: 'armored' | undefined
    } = {
      message: await createMessage({ text: textmessage.value }),
      encryptionKeys: pubkeys
    }

    if (signingKeys) {
      encryptOptions = {
        ...encryptOptions,
        signingKeys
      }
    }

    emit('encrypt', await encrypt(encryptOptions))
  } catch (e) {
    console.log(e)
    if (e instanceof Error) {
      alert(e.message)
    }
  }
}
</script>

<template>
  <form action="/" class="flex flex-col gap-3" @submit.prevent="doEncrypt">
    <div class="form-control">
      <label for="message">
        <span class="label-text">Message</span>
      </label>
      <textarea
        id="message"
        class="textarea textarea-bordered"
        v-model="textmessage"
        required
      ></textarea>
    </div>
    <div class="grid grid-cols-1 gap-2">
      <div v-for="(rpk, index) in recipientPubKeys" :key="index" class="flex items-end gap-2">
        <ImportKeyComponent
          class="flex-grow"
          :label="`Recipient #${index}`"
          placeholder="Please enter your recipient public key"
          v-model="recipientPubKeys[index]"
          :required="true"
        />
        <button
          v-if="recipientPubKeys.length > 1"
          class="btn btn-ghost"
          type="button"
          @click="() => recipientPubKeys.splice(index, 1)"
          tabindex="-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="fill-current size-5" viewBox="0 0 16 16">
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
            />
          </svg>
        </button>
      </div>
      <button class="btn btn-shadow btn-xs" @click="() => recipientPubKeys.push('')" type="button">
        Add Public Key
      </button>
    </div>
    <div class="grid md:flex md:justify-end">
      <button class="btn btn-primary" type="submit">Encrypt Message</button>
    </div>
  </form>
</template>
