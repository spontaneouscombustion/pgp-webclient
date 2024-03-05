<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-square">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li><RouterLink :to="{ name: 'generate' }">Generate</RouterLink></li>
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
          <label for="privkey-drawer" class="drawer-button btn btn-secondary"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              class="fill-current size-5"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"
              /></svg
          ></label>
        </li>
      </ul>
    </div>
  </div>
</template>
