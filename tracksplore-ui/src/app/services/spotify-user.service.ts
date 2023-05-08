import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, switchMap, tap } from "rxjs";
import { SpotifyAccount } from "../models/spotify-account";
import { SpotifyTokenService } from "./spotify-token.service";

@Injectable({
    providedIn: 'root'
})
export class SpotifyUserService {

    private readonly clientId: string = 'f960e70adc2e4d18b35940d638f171a4';
    private readonly redirectUri: string = 'http://localhost:4200/link-spotify-callback';

    private readonly accountSubject: BehaviorSubject<SpotifyAccount | undefined> = new BehaviorSubject<SpotifyAccount | undefined>(undefined);

    public readonly account$: Observable<SpotifyAccount | undefined> = this.accountSubject.asObservable();
    

    constructor(private http: HttpClient, private spotifyTokenService: SpotifyTokenService) { 
        // TODO: missing first() somewhere????
        this.spotifyTokenService.token$.pipe(
            switchMap(() => this.getSpotifyAccount()),
            tap((account) => this.accountSubject.next(account))
        ).subscribe();
    }

    redirectToSpotifyAuthorization() {
        document.location.href = 'https://accounts.spotify.com/authorize?client_id=' + this.clientId 
      + '&response_type=code&redirect_uri=' + this.redirectUri 
      + '&scope=user-top-read,user-library-read,playlist-read-private,user-read-email,user-read-private,user-modify-playback-state,streaming,user-read-playback-state&show_dialog=true';
    }

    private getSpotifyAccount(): Observable<SpotifyAccount | undefined> {
        return this.http.get<SpotifyAccount>('https://api.spotify.com/v1/me');
    }
}