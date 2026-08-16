<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useLeaguesStore } from '../stores/leagues'
import LeagueCard from './LeagueCard.vue'

const store = useLeaguesStore()

const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function observeSentinel() {
  observer?.disconnect()
  if (!sentinel.value) return
  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting && store.hasMoreLeagues) {
      store.loadMoreLeagues()
    }
  })
  observer.observe(sentinel.value)
}

watch(sentinel, observeSentinel)

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div v-if="store.isLoading" class="py-16 text-center text-slate-500">Loading leagues…</div>
  <div v-else-if="store.loadError" class="py-16 text-center text-red-600">
    {{ store.loadError }}
  </div>
  <div v-else-if="store.filteredLeagues.length === 0" class="py-16 text-center text-slate-500">
    No leagues match your filters.
  </div>
  <div v-else>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <LeagueCard
        v-for="league in store.visibleLeagues"
        :key="league.idLeague"
        :league="league"
        @select="store.selectLeague"
      />
    </div>
    <div v-if="store.hasMoreLeagues" ref="sentinel" class="flex justify-center py-8">
      <button
        type="button"
        class="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-brand shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        @click="store.loadMoreLeagues"
      >
        Load more
      </button>
    </div>
  </div>
</template>
