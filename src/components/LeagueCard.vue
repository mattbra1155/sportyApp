<script setup lang="ts">
import type { League } from '../types/league'

defineProps<{ league: League }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <button
    type="button"
    class="flex w-full cursor-pointer flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
    @click="emit('select', league.idLeague)"
  >
    <span class="text-xs font-bold uppercase tracking-wide text-brand">{{
      league.strSport
    }}</span>
    <span class="font-semibold text-ink">{{ league.strLeague }}</span>
    <span v-if="league.strLeagueAlternate" class="text-sm text-slate-500">{{
      league.strLeagueAlternate
    }}</span>
  </button>
</template>
