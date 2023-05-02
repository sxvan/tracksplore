import { Injectable } from "@angular/core";
import { SpotifyTrack } from "../models/spotify-track";
import { SpotifyService } from "./spotify-service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

@Injectable()
export class SpotifyPlayerService {
    constructor(private spotifyService: SpotifyService, private http: HttpClient) { }

    public async playTrack(track: SpotifyTrack, deviceId?: string, access_token?: string) {
        if (!deviceId || !access_token) {
            return;
        }

        const audioAnalysis = await this.spotifyService.getAudioAnalysis(track.id);
        console.log(audioAnalysis);
        const startPosition = Math.trunc(audioAnalysis.sections.slice(0, -1).sort((a, b) => a.loudness < b.loudness ? 1 : -1)[0].start * 1000) - 2000;
    
        await this.startOrResume(track, startPosition, deviceId, access_token);
    }

    private async startOrResume(track: SpotifyTrack, positionMs: number, device_id: string, access_token: string) {
        const url = 'https://api.spotify.com/v1/me/player/play?device_id=' + device_id;
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + access_token });
        const body = {
        context_uri: track.album?.uri,
        offset: {
            uri: track.uri,
        },
        position_ms: positionMs
        };

        await lastValueFrom(this.http.put(url, body, { headers: headers }));
    }
}