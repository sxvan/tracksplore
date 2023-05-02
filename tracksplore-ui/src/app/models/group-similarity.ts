import { SpotifyArtistGroup } from "./spotify-artist-group";
import { SpotifyArtist } from "./spotify-artist";

export class GroupSimilarity {
    constructor(public artistGroup: SpotifyArtistGroup, public artist: SpotifyArtist, public similarity: number) { }
}