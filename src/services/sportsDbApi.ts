import type {
    AllLeaguesResponse,
    League,
    SearchAllLeaguesResponse,
    SeasonBadge,
    SeasonBadgeResponse,
} from '../types/league'

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3'

// The free all_leagues.php key currently only returns a handful of Soccer leagues
// without strLeagueAlternate, so we enrich it with search_all_leagues.php for a
// curated set of sports to get a realistic multi-sport list with alternate names.
const ENRICHMENT_SPORTS = [
    'Soccer',
    'Basketball',
    'Motorsport',
    'Ice Hockey',
    'Baseball',
    'American Football',
    'Rugby',
    'Cricket',
    'Tennis',
    'Cycling',
]

const ALL_LEAGUES_CACHE_KEY = 'sportydb:all-leagues:v1'
const ALL_LEAGUES_CACHE_TTL_MS = 10 * 60 * 1000

interface CachedLeagues {
    fetchedAt: number
    leagues: League[]
}

// module-level promise so concurrent callers (e.g. StrictMode-style double mount) share one fetch
let inFlightRequest: Promise<League[]> | null = null

export async function fetchAllLeagues(): Promise<League[]> {
    const cached = readLeaguesCache()
    if (cached) return cached

    if (!inFlightRequest) {
        inFlightRequest = fetchAndCacheAllLeagues().finally(() => {
            inFlightRequest = null
        })
    }
    return inFlightRequest
}

async function fetchAndCacheAllLeagues(): Promise<League[]> {
    const [baseLeagues, enrichedLeagues] = await Promise.all([
        fetchBaseLeagues(),
        fetchEnrichedLeagues(),
    ])

    const leaguesById = new Map<string, League>()
    for (const league of baseLeagues) leaguesById.set(league.idLeague, league)
    for (const league of enrichedLeagues) leaguesById.set(league.idLeague, league) // richer data wins

    const leagues = Array.from(leaguesById.values())
    writeLeaguesCache(leagues)
    return leagues
}

function readLeaguesCache(): League[] | null {
    try {
        const raw = sessionStorage.getItem(ALL_LEAGUES_CACHE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as CachedLeagues
        if (Date.now() - parsed.fetchedAt > ALL_LEAGUES_CACHE_TTL_MS) return null
        return parsed.leagues
    } catch {
        return null
    }
}

function writeLeaguesCache(leagues: League[]): void {
    try {
        const entry: CachedLeagues = { fetchedAt: Date.now(), leagues }
        sessionStorage.setItem(ALL_LEAGUES_CACHE_KEY, JSON.stringify(entry))
    } catch {
        // sessionStorage may be unavailable (e.g. private browsing) - safe to skip caching
    }
}

async function fetchBaseLeagues(): Promise<League[]> {
    const res = await fetch(`${BASE_URL}/all_leagues.php`)
    if (!res.ok) {
        throw new Error(`Failed to fetch leagues (${res.status})`)
    }
    const data = (await res.json()) as AllLeaguesResponse
    return data.leagues ?? []
}

async function fetchEnrichedLeagues(): Promise<League[]> {
    const results = await Promise.allSettled(ENRICHMENT_SPORTS.map(fetchLeaguesBySport))
    return results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
}

async function fetchLeaguesBySport(sport: string): Promise<League[]> {
    const res = await fetch(`${BASE_URL}/search_all_leagues.php?s=${encodeURIComponent(sport)}`)
    if (!res.ok) return []
    const data = (await res.json()) as SearchAllLeaguesResponse
    return data.countries ?? []
}

export async function fetchSeasonBadge(leagueId: string): Promise<SeasonBadge | null> {
    const res = await fetch(
        `${BASE_URL}/search_all_seasons.php?badge=1&id=${encodeURIComponent(leagueId)}`,
    )
    if (!res.ok) {
        throw new Error(`Failed to fetch season badge (${res.status})`)
    }
    const data = (await res.json()) as SeasonBadgeResponse
    const seasons = data.seasons ?? []
    // prefer the first season that actually has a badge image
    return seasons.find((season) => season.strBadge) ?? seasons[0] ?? null
}
