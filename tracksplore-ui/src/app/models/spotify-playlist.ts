export class SpotifyPlaylists {
    constructor(public items: SpotifyPlaylist[], public next: string) { }
}

export class SpotifyPlaylist {
    constructor (public tracks: SpotifyPlaylistTracks) { }
}

export class SpotifyPlaylistTracks {
    constructor (public href: string, public total: number) { }
}