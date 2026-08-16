<script setup lang="ts">
import { useLeaguesStore } from '../stores/leagues'
import LeagueCard from './LeagueCard.vue'

const store = useLeaguesStore()
</script>

<template>
  <div v-if="store.isLoading" class="py-16 text-center text-slate-500">Loading leagues…</div>
  <div v-else-if="store.loadError" class="py-16 text-center text-red-600">
    {{ store.loadError }}
  </div>
  <div v-else-if="store.filteredLeagues.length === 0" class="py-16 text-center text-slate-500">
    No leagues match your filters.
  </div>
  <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <LeagueCard
      v-for="league in store.filteredLeagues"
      :key="league.idLeague"
      :league="league"
      @select="store.selectLeague"
    />
  </div>
</template>
