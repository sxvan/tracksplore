import { HttpClient } from "@angular/common/http";
import { SpotifyArtist } from "../models/spotify-artist";
import { lastValueFrom } from "rxjs";
import { SpotifyTopArtists } from "../models/spotify-top-artists";
import { SpotifyTrack } from "../models/spotify-track";
import { SpotifyTopTracks } from "../models/spotify-top-tracks";
import { SpotifyPlaylist, SpotifyPlaylists } from "../models/spotify-playlist";
import { SpotifyPlaylistTracks } from "../models/spotify-playlist-track";
import { SpotifySavedTrack, SpotifySavedTracks } from "../models/spotify-saved-track";
import { SpotifyAudioAnalysis } from "../models/spotify-audio-analysis";
import { SpotifyTrackRecommendations } from "../models/spotify-track-recommendations";
import { SpotifyRelatedArtists } from "../models/spotify-related-artists";
import { Injectable } from "@angular/core";
import { MusicTasteModel } from "../models/music-taste-model";

@Injectable()
export class SpotifyService {

    constructor(private http: HttpClient) {
    }

    public async getTopArtists(resultCount: number): Promise<SpotifyArtist[]> {
        const url = 'https://api.spotify.com/v1/me/top/artists?limit=' + resultCount;

        const topArtists = await lastValueFrom(this.http.get<SpotifyTopArtists>(url));
        return topArtists.items;
    }

    public async getTopTracks(resultCount: number): Promise<SpotifyTrack[]> {
        let url = 'https://api.spotify.com/v1/me/top/tracks?limit=' + resultCount;

        let tracks: SpotifyTrack[] = [];
        let topTracks;
        do {
            topTracks = await lastValueFrom(this.http.get<SpotifyTopTracks>(url));
            tracks = tracks.concat(topTracks.items);
            url = topTracks.next;
        } while (!!url);

        return tracks;
    }

    public async getSavedTracks(): Promise<SpotifyTrack[]> {
        let url = 'https://api.spotify.com/v1/me/tracks?limit=50';

        let savedTracks: SpotifySavedTrack[] = [];
        let savedTracksResult;
        do {
            savedTracksResult = await lastValueFrom(this.http.get<SpotifySavedTracks>(url));
            savedTracks = savedTracks.concat(savedTracksResult.items);
            url = savedTracksResult.next;
        } while (!!url)

        return savedTracks.map(i => { return i.track });
    }

    public async getRelatedArtists(artistId: string): Promise<SpotifyArtist[]> {
        const url = 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists';

        const relatedArtistsResult = await lastValueFrom(this.http.get<SpotifyRelatedArtists>(url));
        return relatedArtistsResult.artists;
    }

    public async getAudioAnalysis(trackId: string): Promise<SpotifyAudioAnalysis> {
        const url = 'https://api.spotify.com/v1/audio-analysis/' + trackId;

        return await lastValueFrom(this.http.get<SpotifyAudioAnalysis>(url));
    }

    public async getArtist(artistId: string): Promise<SpotifyArtist> {
        const url = 'https://api.spotify.com/v1/artists/' + artistId;

        return await lastValueFrom(this.http.get<SpotifyArtist>(url));
    }


    public async getRecommendations(musicTaste: MusicTasteModel, limit: number): Promise<SpotifyTrack[]> {
        let url = 'https://api.spotify.com/v1/recommendations?limit=' + limit + '&seed_artists=';
        let threshhold = musicTaste.artistIds.length < 5 ? musicTaste.artistIds.length : 5;

        const selectedArtistIds: string[] = [];
        for (let i = 0; i < threshhold; i++) {
            let index = this.getRndInteger(0, musicTaste.artistIds.length - 1);
            selectedArtistIds.push(musicTaste.artistIds[index]);
        }

        for (let id of selectedArtistIds) {
            url += id + ',';
        }

        const recommendationsResult = await lastValueFrom(this.http.get<SpotifyTrackRecommendations>(url));
        return recommendationsResult.tracks;
    }

    public async getAllPlaylistTracks(): Promise<SpotifyTrack[]> {
        let tracks: SpotifyTrack[] = [];
        const playlists = await this.getPlaylists(50);
        for (let playlist of playlists) {
            tracks = tracks.concat(await this.getPlaylistTracksByUrl(playlist.tracks.href));
        }

        return tracks;
    }

    public async getTrack(trackId: string) {
        const url = 'https://api.spotify.com/v1/tracks/' + trackId;

        const track = await lastValueFrom(this.http.get<SpotifyTrack>(url));
        return track;
    }

    private async getPlaylists(playlistCount: number): Promise<SpotifyPlaylist[]> {
        let url = 'https://api.spotify.com/v1/me/playlists?limit=' + playlistCount;

        let playlistsResult;
        let playlists: SpotifyPlaylist[] = [];
        do {
            playlistsResult = await lastValueFrom(this.http.get<SpotifyPlaylists>(url));
            playlists = playlists.concat(playlistsResult.items);
            url = playlistsResult.next;
        } while (!!url);

        return playlists;
    }

    private async getPlaylistTracksByUrl(url: string): Promise<SpotifyTrack[]> {

        let tracks: SpotifyTrack[] = [];
        do {
            const tracksResult = await lastValueFrom(this.http.get<SpotifyPlaylistTracks>(url));
            tracks = tracks.concat(tracksResult.items.map(i => i.track));
            url = tracksResult.next;
        } while (!!url)

        return tracks.filter(t => t !== null);
    }

    private getRndInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}