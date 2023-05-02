import { SpotifyAlbum } from "./spotify-album";
import { SpotifyArtist } from "./spotify-artist";

export class SpotifyTrack {
    constructor(public id: string, 
        public name: string, 
        public popularity: number, 
        public artists: SpotifyArtist[], 
        public preview_url: string, 
        public uri: string, 
        public track_number: number, 
        public album: SpotifyAlbum) {

    }
}