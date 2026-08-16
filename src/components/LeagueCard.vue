<script setup lang="ts">
import type { League } from '../types/league'

defineProps<{ league: League }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <button
    type="button"
    class="flex w-full flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
    @click="emit('select', league.idLeague)"
  >
    <span class="text-xs font-semibold uppercase tracking-wide text-indigo-600">{{
      league.strSport
    }}</span>
    <span class="font-semibold text-slate-900">{{ league.strLeague }}</span>
    <span v-if="league.strLeagueAlternate" class="text-sm text-slate-500">{{
      league.strLeagueAlternate
    }}</span>
  </button>
</template>
