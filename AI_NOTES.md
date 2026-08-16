# AI Tools & Design Notes

## AI tools used

- **GitHub Copilot (Claude Sonnet 5, agent mode in VS Code)** — used for the entire implementation: project scaffolding, component code, Pinia store, API service layer, and these notes. I reviewed and directed the plan (tech stack choices, file structure) before code generation, and verified behavior manually in-browser (search, sport filter, badge modal, caching) and via `npm run build`.

## Design decisions

- **Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS v4**, as agreed. No router — this is a single view, so routing would be unnecessary complexity.
- **Component split**: `SearchBar`, `SportFilterDropdown`, `LeagueList`/`LeagueCard`, `SeasonBadgeModal`. Filter components read/write the Pinia store directly rather than prop-drilling, since the app is small and single-page.
- **State/caching**: the Pinia store keeps a `Map<leagueId, {loading, data, error}>` for season badges. Clicking a league checks the cache before calling the API, satisfying the "avoid repeat calls" requirement.
- **Sport dropdown options** are derived from the fetched league data (unique `strSport` values), not hardcoded, so it stays accurate if the dataset changes.

## API limitation encountered

The assignment points at `all_leagues.php` for the league list. In practice, under the current free test key (`3`), that endpoint only returns 5 hardcoded Soccer leagues and does **not** include `strLeagueAlternate` — this appears to be a restriction TheSportsDB added to its free tier after this assignment was written.

To still demonstrate meaningful search + sport filtering (multiple sports, `strLeagueAlternate` populated), the app also queries `search_all_leagues.php?s=<sport>` — the same API family/key, documented on the same site — for a curated list of sports (Soccer, Basketball, Motorsport, Ice Hockey, Baseball, American Football, Rugby, Cricket, Tennis, Cycling), and merges those results with `all_leagues.php`, preferring the richer records when both return the same league. This is a pragmatic adaptation to the current live API behavior, not a deviation from the intended product logic — the base `all_leagues.php` call is still made and used first, exactly as specified.

## What I'd do next with more time

- Debounce the search input (currently filters on every keystroke, which is fine at this data size but wouldn't scale).
- Persist the badge cache to `sessionStorage` so it survives a page reload.
- Add unit tests for the store's filtering logic and the API merge/dedupe logic.
- Add a small loading skeleton instead of plain "Loading…" text.
