<script setup lang="ts">
import { computed } from 'vue'
import { useLeaguesStore } from '../stores/leagues'

const store = useLeaguesStore()

const league = computed(
  () => store.leagues.find((l) => l.idLeague === store.activeLeagueId) ?? null,
)
</script>

<template>
  <div
    v-if="store.activeLeagueId"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
    @click.self="store.closeBadge()"
  >
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-start justify-between gap-4">
        <h2 class="text-lg font-semibold text-slate-900">{{ league?.strLeague }}</h2>
        <button
          type="button"
          aria-label="Close"
          class="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          @click="store.closeBadge()"
        >
          ✕
        </button>
      </div>

      <div v-if="store.activeBadge?.loading" class="py-10 text-center text-slate-500">
        Loading badge…
      </div>
      <div v-else-if="store.activeBadge?.error" class="py-10 text-center text-red-600">
        {{ store.activeBadge.error }}
      </div>
      <div
        v-else-if="store.activeBadge?.data?.strBadge"
        class="flex flex-col items-center gap-3"
      >
        <img
          :src="store.activeBadge.data.strBadge"
          :alt="`${league?.strLeague} season badge`"
          class="max-h-64 w-auto object-contain"
        />
        <p v-if="store.activeBadge.data.strDescriptionEN" class="text-sm text-slate-600">
          {{ store.activeBadge.data.strDescriptionEN }}
        </p>
      </div>
      <div v-else class="py-10 text-center text-slate-500">
        No season badge available for this league.
      </div>
    </div>
  </div>
</template>
