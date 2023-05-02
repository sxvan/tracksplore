import { SpotifyArtist } from "./spotify-artist";

export class SpotifyTopArtists {
    constructor(public items: SpotifyArtist[], public next: string) { }
}