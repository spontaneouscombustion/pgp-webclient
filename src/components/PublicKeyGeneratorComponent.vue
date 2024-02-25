<script lang="ts" setup>
    import { ref } from 'vue'
    import { readKey } from 'openpgp'

    const privateKey = ref<string>("")
    const password = ref<string>("")
    const result = ref<string>("")

    async function doExtract(){

        result.value = ""

        const privateKeyObject = await readKey({
            armoredKey: privateKey.value
        })

        result.value = privateKeyObject.toPublic().armor()

    }


</script>

<template>
    <div>
        <h1>Extract Public Key from Private Key</h1>
        <form action="/" @submit.prevent="doExtract">
            <div>
                <label>Enter Private Key</label>
                <textarea v-model="privateKey"></textarea>
            </div>
            <div>
                <label>Password</label>
                <input v-model="password" type="password"/>
            </div>
            <div>
                <button type="submit">Generate Public Key</button>
            </div>
        </form>
    </div>
    <div v-if="result">
        <pre v-text="result"></pre>
    </div>
</template>