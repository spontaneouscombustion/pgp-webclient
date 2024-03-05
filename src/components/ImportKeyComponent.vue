<script lang="ts" setup>
import { onMounted, ref } from 'vue'

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
const inputId = ref<string>('')

function importKeyFile(e: Event): void {
  const target = e.target as HTMLInputElement
  if (target.files && target.files instanceof FileList) {
    const keyfile = target.files[0]
    if (keyfile.type === 'text/plain') {
      const reader = new FileReader()
      reader.readAsText(keyfile, 'UTF-8')
      reader.onload = (evt) => {
        if (evt.target) {
          inputModel.value = evt.target.result as string
          // unarmor(maybeArmored)
          //     .then(result => {
          //         inputModel.value = result.text
          //     }).catch(() => {
          //         inputModel.value = maybeArmored
          //     })
        }
      }
    }
  }
}

onMounted(() => {
  inputId.value = Math.random().toString(36).substring(2, 7)
})
</script>

<template>
  <div class="form-control">
    <label class="label" :for="inputId">
      <span class="label-text" v-text="label"></span>
      <div class="">
        <input
          type="file"
          @change="importKeyFile"
          class="file-input file-input-ghost file-input-xs"
          tabindex="-1"
        />
      </div>
    </label>
    <textarea
      :placeholder="placeholder"
      class="textarea textarea-bordered"
      :id="inputId"
      v-model="inputModel"
      :required="required"
    ></textarea>
  </div>
</template>
