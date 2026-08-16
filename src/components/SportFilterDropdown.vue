<script setup lang="ts">
import { useLeaguesStore } from '../stores/leagues'

const store = useLeaguesStore()
</script>

<template>
  <select
    v-model="store.selectedSport"
    aria-label="Filter by sport"
    class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:w-56"
  >
    <option value="">All sports</option>
    <option v-for="sport in store.sportOptions" :key="sport" :value="sport">
      {{ sport }}
    </option>
  </select>
</template>
