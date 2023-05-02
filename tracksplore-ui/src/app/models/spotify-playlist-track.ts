import { SpotifyTrack } from "./spotify-track";

export class SpotifyPlaylistTracks {
    constructor(public items: SpotifyPlaylistTrack[], public next: string) { }
}

export class SpotifyPlaylistTrack {
    constructor(public track: SpotifyTrack) { }
}