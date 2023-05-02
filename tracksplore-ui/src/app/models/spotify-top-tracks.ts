import { SpotifyTrack } from "./spotify-track";

export class SpotifyTopTracks {
    constructor(public items: SpotifyTrack[], public next: string) { }
}