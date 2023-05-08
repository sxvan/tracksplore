import { SpotifyImage } from "./spotify-image";

export class SpotifyAlbum {
    constructor(public uri: string, public images: SpotifyImage[]) { }
}