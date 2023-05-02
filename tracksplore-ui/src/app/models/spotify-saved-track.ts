import { SpotifyTrack } from "./spotify-track";

export class SpotifySavedTrack {
    constructor(public track: SpotifyTrack) { }
}

export class SpotifySavedTracks {
    constructor(public items: SpotifySavedTrack[], public next: string) { }
}