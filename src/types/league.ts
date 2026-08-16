export interface League {
    idLeague: string
    strLeague: string
    strSport: string
    strLeagueAlternate: string | null
}

export interface AllLeaguesResponse {
    leagues: League[] | null
}

export interface SearchAllLeaguesResponse {
    countries: League[] | null
}

export interface SeasonBadge {
    strSeason: string | null
    strBadge: string | null
    strDescriptionEN: string | null
}

export interface SeasonBadgeResponse {
    seasons: SeasonBadge[] | null
}
