import { SpotifyArtist } from "./spotify-artist";
import { SpotifyGenre } from "./spotify-genre";

export class SpotifyArtistGroup {
    constructor(public artists: SpotifyArtist[], public relatedGenres: SpotifyGenre[], public isDisabled: boolean = false) { }
}