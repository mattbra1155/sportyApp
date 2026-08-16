import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchAllLeagues, fetchSeasonBadge } from '../services/sportsDbApi'
import type { League, SeasonBadge } from '../types/league'

interface BadgeCacheEntry {
  loading: boolean
  data: SeasonBadge | null
  error: string | null
}

export const useLeaguesStore = defineStore('leagues', () => {
  const leagues = ref<League[]>([])
  const isLoading = ref(false)
  const loadError = ref<string | null>(null)

  const searchTerm = ref('')
  const selectedSport = ref('')

  // keyed by league id so repeat clicks on the same league reuse the cached response
  const badgeCache = ref(new Map<string, BadgeCacheEntry>())
  const activeLeagueId = ref<string | null>(null)

  const sportOptions = computed(() => {
    const sports = new Set(leagues.value.map((league) => league.strSport).filter(Boolean))
    return Array.from(sports).sort()
  })

  const filteredLeagues = computed(() => {
    const term = searchTerm.value.trim().toLowerCase()
    return leagues.value.filter((league) => {
      const matchesTerm = !term || league.strLeague.toLowerCase().includes(term)
      const matchesSport = !selectedSport.value || league.strSport === selectedSport.value
      return matchesTerm && matchesSport
    })
  })

  const activeBadge = computed(() =>
    activeLeagueId.value ? (badgeCache.value.get(activeLeagueId.value) ?? null) : null,
  )

  async function loadLeagues() {
    isLoading.value = true
    loadError.value = null
    try {
      leagues.value = await fetchAllLeagues()
    } catch (err) {
      loadError.value = err instanceof Error ? err.message : 'Failed to load leagues'
    } finally {
      isLoading.value = false
    }
  }

  async function selectLeague(leagueId: string) {
    activeLeagueId.value = leagueId

    if (badgeCache.value.has(leagueId)) {
      return
    }

    badgeCache.value.set(leagueId, { loading: true, data: null, error: null })
    try {
      const badge = await fetchSeasonBadge(leagueId)
      badgeCache.value.set(leagueId, { loading: false, data: badge, error: null })
    } catch (err) {
      badgeCache.value.set(leagueId, {
        loading: false,
        data: null,
        error: err instanceof Error ? err.message : 'Failed to load season badge',
      })
    }
  }

  function closeBadge() {
    activeLeagueId.value = null
  }

  return {
    leagues,
    isLoading,
    loadError,
    searchTerm,
    selectedSport,
    sportOptions,
    filteredLeagues,
    activeLeagueId,
    activeBadge,
    loadLeagues,
    selectLeague,
    closeBadge,
  }
})
