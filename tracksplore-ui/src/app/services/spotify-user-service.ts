import { Injectable } from "@angular/core";
import { AccessToken } from "../models/access-token";
import { Token } from "@angular/compiler";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { SpotifyAccount } from "../models/spotify-account";

@Injectable({
    providedIn: 'root'
})
export class SpotifyUserService {

    constructor(private http: HttpClient) {
    }

    setAccessToken(access_token: AccessToken) {
        localStorage.setItem('access_token', JSON.stringify(access_token));
    }

    getAccessToken(): AccessToken | undefined {
        const access_token_json = localStorage.getItem('access_token');
        if (!access_token_json) {
            return undefined;
        }

        return JSON.parse(access_token_json);
    }

    async getSpotifyAccount(): Promise<SpotifyAccount | undefined> {
        const token = this.getAccessToken();
        if (!token) {
            return undefined;
        }

        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token.access_token });
        return await lastValueFrom(this.http.get<SpotifyAccount>('https://api.spotify.com/v1/me', { headers: headers }));
    }
}