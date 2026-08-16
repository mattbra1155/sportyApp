<script setup lang="ts">
import { useLeaguesStore } from '../stores/leagues'

const store = useLeaguesStore()
</script>

<template>
  <input
    v-model="store.searchTerm"
    type="search"
    placeholder="Search leagues by name..."
    aria-label="Search leagues"
    class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
  />
</template>
