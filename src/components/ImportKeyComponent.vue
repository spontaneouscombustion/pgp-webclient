<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Html5Qrcode, type CameraDevice } from 'html5-qrcode'

withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    required?: boolean
  }>(),
  {
    label: '',
    placeholder: '',
    required: false
  }
)

const inputModel = defineModel<string>()
const readerId = ref<string>(Math.random().toString(36).substring(2, 7))
const scanner = ref<Html5Qrcode>()
const cameras = ref<CameraDevice[]>([])

async function importKeyFile(e: Event): Promise<void> {
  const target = e.target as HTMLInputElement
  if (target.files && target.files instanceof FileList) {
    const keyfile = target.files[0]
    console.log(keyfile.type)
    if (keyfile.type === 'text/plain') {
      const reader = new FileReader()
      reader.readAsText(keyfile, 'UTF-8')
      reader.onload = (evt) => {
        if (evt.target) {
          inputModel.value = evt.target.result as string
        }
      }
    }
    if (['image/jpeg', 'image/jpg', 'image/png'].includes(keyfile.type)) {
      try {
        inputModel.value = await scanner.value?.scanFile(keyfile, false)
      } catch (err) {
        console.log(err)
        if (err instanceof Error) {
          alert(err.message)
        }
      }
    }
  }
}

async function scan(cameraId: string): Promise<void> {
  try {
    scanner.value?.start(
      cameraId,
      {
        qrbox: {
          width: 250,
          height: 250
        },
        fps: 10
      },
      (decodedText) => {
        inputModel.value = decodedText
      },
      (errorMessage) => {
        console.log(errorMessage)
      }
    )
  } catch (err) {
    console.log(err)
    if (err instanceof Error) {
      alert(err.message)
    }
  } finally {
    scanner.value?.stop()
  }
}

onMounted(async () => {
  scanner.value = new Html5Qrcode(readerId.value)
  try {
    cameras.value = await Html5Qrcode.getCameras()
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <div class="form-control">
    <div class="label">
      <span class="label-text" v-text="label"></span>
      <div class="flex">
        <div tabindex="0" class="dropdown" v-if="cameras.length > 0">
          <div role="button" class="btn btn-xs btn-neutral">
            <svg xmlns="http://www.w3.org/2000/svg" class="fill-current size-3" viewBox="0 0 16 16">
              <path
                d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"
              />
              <path
                d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"
              />
            </svg>
            QR
          </div>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li v-for="camera in cameras" :key="camera.id">
              <button type="button" @click="scan(camera.id)">{{ camera.label }}</button>
            </li>
          </ul>
        </div>
        <input
          type="file"
          @change="importKeyFile"
          class="file-input file-input-ghost file-input-xs"
          tabindex="-1"
        />
      </div>
    </div>
    <textarea
      :placeholder="placeholder"
      class="textarea textarea-bordered"
      v-model="inputModel"
      :required="required"
    ></textarea>
    <div :id="readerId"></div>
    <button
      class="p-2 btn btn-neutral btn-wide"
      v-if="scanner?.isScanning"
      type="button"
      @click="scanner.stop()"
    >
      Cancel
    </button>
  </div>
</template>
