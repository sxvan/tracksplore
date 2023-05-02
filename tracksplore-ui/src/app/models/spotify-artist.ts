import { SpotifyGenre } from "./spotify-genre";

export class SpotifyArtist {
    constructor(public id: string, 
        public name: string, 
        public popularity: number, 
        public genres: string[],
        public relatedGenres: SpotifyGenre[],
        public relatedArtists: SpotifyArtist[],
        public trackCount: number) {

        }
}