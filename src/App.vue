<script setup lang="ts">
import { onMounted } from 'vue'
import { useLeaguesStore } from './stores/leagues'
import SearchBar from './components/SearchBar.vue'
import SportFilterDropdown from './components/SportFilterDropdown.vue'
import LeagueList from './components/LeagueList.vue'
import SeasonBadgeModal from './components/SeasonBadgeModal.vue'

const store = useLeaguesStore()

onMounted(() => {
  store.loadLeagues()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-6">
        <h1 class="text-2xl font-bold text-slate-900">Sports Leagues</h1>
        <p class="text-sm text-slate-500">
          Browse leagues, filter by sport, and view season badges.
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row">
        <div class="flex-1">
          <SearchBar />
        </div>
        <SportFilterDropdown />
      </div>

      <LeagueList />
    </main>

    <SeasonBadgeModal />
  </div>
</template>
