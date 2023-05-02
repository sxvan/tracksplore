import { SpotifyArtist } from "./spotify-artist";

export class Similarity {
    constructor(public source: SpotifyArtist, public target: SpotifyArtist, public similarity: number) { }
}