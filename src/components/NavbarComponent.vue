<script setup lang="ts">
    import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="navbar bg-base-100">
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost btn-square">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </div>
                <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li><RouterLink :to="{ name: 'generate' }">Generate</RouterLink></li>
                    <li><RouterLink :to="{ name: 'publickey' }">Extract Public Key</RouterLink></li>
                    <li><RouterLink :to="{ name: 'encrypt' }">Encrypt</RouterLink></li>
                    <li><RouterLink :to="{ name: 'decrypt' }">Decrypt</RouterLink></li>
                    <li><RouterLink :to="{ name: 'sign' }">Sign</RouterLink></li>
                    <li><RouterLink :to="{ name: 'verify' }">Verify</RouterLink></li>
                    <li><RouterLink :to="{ name: 'revoke' }">Revoke</RouterLink></li>
                </ul>
            </div>
            <router-link class="btn btn-ghost text-xl" :to="{ name: 'home' }">PGP Tools</router-link>
        </div>
        <div class="navbar-end">
            <ul class="menu menu-horizontal px-1">
                <li>
                    <RouterLink :to="{ name: 'home' }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="fill-current size-5" viewBox="0 0 16 16"><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/></svg>
                        Home
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>