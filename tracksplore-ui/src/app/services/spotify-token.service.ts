import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, tap } from "rxjs";
import { SpotifyToken } from "../models/spotify-token";
import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class SpotifyTokenService {
    private readonly clientId: string = 'f960e70adc2e4d18b35940d638f171a4';
    private readonly redirectUri: string = 'http://localhost:4200/link-spotify-callback';

    private readonly http: HttpClient;

    private readonly tokenSubject$: BehaviorSubject<SpotifyToken | undefined> = new BehaviorSubject<SpotifyToken | undefined>(this.getToken());
    
    public readonly token$: Observable<SpotifyToken | undefined> = this.tokenSubject$.asObservable();

    constructor(httpBackend: HttpBackend) {
        this.http = new HttpClient(httpBackend);
    }
    
    authenticate(code: string): Observable<SpotifyToken> {
        const url = 'https://accounts.spotify.com/api/token';
        const body = new HttpParams().appendAll({
            'grant_type': 'authorization_code',
            'redirect_uri': 'http://localhost:4200/link-spotify-callback',
            'code': code
        });
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa("f960e70adc2e4d18b35940d638f171a4:470b3992d0df4564962ddef751399804")
        });

        return this.http.post<SpotifyToken>(url, body, { headers: headers }).pipe(
            tap((spotifyToken) => this.setToken(spotifyToken))
        );
    }    

    refreshAccessToken(): Observable<SpotifyToken | undefined> {
        const token = this.getToken();
        if (!token) {
            return of(undefined);
        }

        const url = 'https://accounts.spotify.com/api/token';
        const body = new HttpParams().appendAll({
            'grant_type': 'refresh_token',
            'refresh_token': token.refresh_token
        });

        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa("f960e70adc2e4d18b35940d638f171a4:470b3992d0df4564962ddef751399804")
        });

        return this.http.post<SpotifyToken>(url, body, { headers: headers }).pipe(
            tap((spotifyToken) => this.setToken(spotifyToken))
        );
    }

    redirectToSpotifyAuthorization() {
        const params = new HttpParams().appendAll({
            'client_id': this.clientId,
            'response_type': 'code',
            'redirect_uri': this.redirectUri,
            'scope': 'user-top-read,user-library-read,playlist-read-private,user-read-email,user-read-private,user-modify-playback-state,streaming,user-read-playback-state',
            'show_dialog': true
        });

        document.location.href = 'https://accounts.spotify.com/authorize' + params;
    }

    getToken(): SpotifyToken | undefined {
        const access_token_json = localStorage.getItem('spotify_token');
        if (!access_token_json) {
            return undefined;
        }

        return JSON.parse(access_token_json);
    }

    clearToken() {
        localStorage.removeItem('spotify_token');
        this.tokenSubject$.next(undefined);
    }

    private setToken(token: SpotifyToken) {
        localStorage.setItem('spotify_token', JSON.stringify(token));
        this.tokenSubject$.next(token);
    }
}