# Sports Leagues

A small SPA that lists sports leagues from [TheSportsDB](https://www.thesportsdb.com/free_sports_api), with search, sport filtering, and a season badge lookup on click.

## Stack

- Vue 3 (`<script setup>`, Composition API)
- Vite + TypeScript
- Pinia for state management
- Tailwind CSS v4 for styling

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # preview the production build
```

No environment variables or API keys are required — TheSportsDB's public test key `3` is used directly from the browser.

## Architecture

```
src/
├── types/league.ts           # League / SeasonBadge API shapes
├── services/sportsDbApi.ts   # fetch wrappers for TheSportsDB endpoints
├── stores/leagues.ts         # Pinia store: fetch, search/sport filters, badge cache
└── components/
    ├── SearchBar.vue
    ├── SportFilterDropdown.vue
    ├── LeagueList.vue
    ├── LeagueCard.vue
    └── SeasonBadgeModal.vue
```

- `useLeaguesStore` holds the league list, the derived `filteredLeagues` (search + sport, both applied together), and a `Map`-based cache of season badge lookups keyed by league id — clicking the same league again reuses the cached response instead of re-calling the API.
- Sport dropdown options are derived from the fetched data (`sportOptions`), not hardcoded.

## Note on the All Leagues API

The assignment's documented endpoint (`all_leagues.php`) is called first, but under the current free test key it only returns 5 hardcoded Soccer leagues and omits `strLeagueAlternate` entirely (a change TheSportsDB made to its free tier after this assignment was likely written). To still deliver a meaningful multi-sport filtering demo, `fetchAllLeagues()` additionally queries `search_all_leagues.php?s=<sport>` (same API/key, documented alternate endpoint) for a curated list of sports (Soccer, Basketball, Motorsport, Ice Hockey, Baseball, American Football, Rugby, Cricket, Tennis, Cycling) and merges the results in, preferring the richer records. This is done client-side with no extra backend. See [AI_NOTES.md](AI_NOTES.md) for more detail.

## Season badge lookup

Clicking a league card calls `search_all_seasons.php?badge=1&id=<id>`, picks the first season with a non-null `strBadge`, and shows the image plus `strDescriptionEN` in a modal. Results are cached in-memory per league id for the lifetime of the page.
