import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SpotifyArtist } from "../models/spotify-artist";
import { SpotifyUserService } from "./spotify-user-service";
import { lastValueFrom } from "rxjs";
import { SpotifyTopArtists } from "../models/spotify-top-artists";
import { SpotifyTrack } from "../models/spotify-track";
import { SpotifyTopTracks } from "../models/spotify-top-tracks";
import { SpotifyPlaylist, SpotifyPlaylists } from "../models/spotify-playlist";
import { SpotifyPlaylistTracks } from "../models/spotify-playlist-track";
import { SpotifySavedTrack, SpotifySavedTracks } from "../models/spotify-saved-track";
import { SpotifyAudioAnalysis } from "../models/spotify-audio-analysis";
import { SpotifyArtistGroup } from "../models/spotify-artist-group";
import { SpotifyTrackRecommendations } from "../models/spotify-track-recommendations";
import { SpotifyRelatedArtists } from "../models/spotify-related-artists";
import { Injectable } from "@angular/core";
import { MusicTasteModel } from "../models/music-taste-model";

@Injectable()
export class SpotifyService {
    private access_token: string | undefined;

    constructor(private http: HttpClient, private spotifyUserService: SpotifyUserService) {
        this.access_token = spotifyUserService.getAccessToken()?.access_token;
    }

    public async getTopArtists(resultCount: number): Promise<SpotifyArtist[]> {
        const url = 'https://api.spotify.com/v1/me/top/artists?limit=' + resultCount;
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.access_token });

        const topArtists = await lastValueFrom(this.http.get<SpotifyTopArtists>(url, { headers: headers }));
        return topArtists.items;
    }

    public async getTopTracks(resultCount: number): Promise<SpotifyTrack[]> {
        let url = 'https://api.spotify.com/v1/me/top/tracks?limit=' + resultCount;
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.access_token });

        let tracks: SpotifyTrack[] = [];
        let topTracks;
        do {
            topTracks = await lastValueFrom(this.http.get<SpotifyTopTracks>(url, { headers: headers }));
            tracks = tracks.concat(topTracks.items);
            url = topTracks.next;
        } while (!!url);

        return tracks;
    }

    public async getSavedTracks(): Promise<SpotifyTrack[]> {
        let url = 'https://api.spotify.com/v1/me/tracks?limit=50';
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.access_token });

        let savedTracks: SpotifySavedTrack[] = [];
        let savedTracksResult;
        do {
            savedTracksResult = await lastValueFrom(this.http.get<SpotifySavedTracks>(url, { headers: headers }));
            savedTracks = savedTracks.concat(savedTracksResult.items);
            url = savedTracksResult.next;
        } while (!!url)

        return savedTracks.map(i => { return i.track });
    }

    public async getRelatedArtists(artistId: string): Promise<SpotifyArtist[]> {
        const url = 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists';
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.access_token });

        const relatedArtistsResult = await lastValueFrom(this.http.get<SpotifyRelatedArtists>(url, { headers: headers }));
        return relatedArtistsResult.artists;
    }

    public async getAudioAnalysis(trackId: string): Promise<SpotifyAudioAnalysis> {
        const url = 'https://api.spotify.com/v1/audio-analysis/' + trackId;
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.access_token });

        return await lastValueFrom(this.http.get<SpotifyAudioAnalysis>(url, { headers: headers }));
    }

    public async getArtist(artistId: string): Promise<SpotifyArtist> {
        const url = 'https://api.spotify.com/v1/artists/' + artistId;
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.access_token });

        return await lastValueFrom(this.http.get<SpotifyArtist>(url, { headers: headers }));
    }


    public async getRecommendations(musicTaste: MusicTasteModel): Promise<SpotifyTrack[]> {
        let url = 'https://api.spotify.com/v1/recommendations?limit=' + musicTaste.artistIds.length + '&seed_artists=';
        let threshhold = musicTaste.artistIds.length < 5 ? musicTaste.artistIds.length : 5;

        const selectedArtistIds: string[] = [];
        for (let i = 0; i < threshhold; i++) {
            let index = this.getRndInteger(0, musicTaste.artistIds.length - 1);
            selectedArtistIds.push(musicTaste.artistIds[index]);
        }

        for (let id of selectedArtistIds) {
            url += id + ',';
        }

        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.access_token });
        const recommendationsResult = await lastValueFrom(this.http.get<SpotifyTrackRecommendations>(url, { headers: headers }));
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

    private async getPlaylists(playlistCount: number): Promise<SpotifyPlaylist[]> {
        let url = 'https://api.spotify.com/v1/me/playlists?limit=' + playlistCount;
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.access_token });

        let playlistsResult;
        let playlists: SpotifyPlaylist[] = [];
        do {
            playlistsResult = await lastValueFrom(this.http.get<SpotifyPlaylists>(url, { headers: headers }));
            playlists = playlists.concat(playlistsResult.items);
            url = playlistsResult.next;
        } while (!!url);

        return playlists;
    }

    private async getPlaylistTracksByUrl(url: string): Promise<SpotifyTrack[]> {
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.access_token });

        let tracks: SpotifyTrack[] = [];
        do {
            const tracksResult = await lastValueFrom(this.http.get<SpotifyPlaylistTracks>(url, { headers: headers }));
            tracks = tracks.concat(tracksResult.items.map(i => i.track));
            url = tracksResult.next;
        } while (!!url)

        return tracks.filter(t => t !== null);
    }

    private getRndInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}