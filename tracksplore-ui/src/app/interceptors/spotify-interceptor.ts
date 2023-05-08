import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, filter, first, switchMap, tap, throwError } from "rxjs";
import { SpotifyUserService } from "../services/spotify-user.service";
import { SpotifyToken } from "../models/spotify-token";
import { SpotifyTokenService } from "../services/spotify-token.service";

@Injectable()
export class SpotifyInterceptor implements HttpInterceptor {

    private isRefreshingSubject$ = new BehaviorSubject<boolean>(false);

    constructor(private spotifyTokenService: SpotifyTokenService) {
        
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.url.includes('api.spotify.com')) {
            return next.handle(req);
        }

        const token = this.spotifyTokenService.getToken();
        if (!token) {
            return next.handle(req);
        }

        const authorizedReq = this.getRequestWithAuthorizationHeader(req, token);
        return next.handle(authorizedReq).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(req, next);
                }

                return throwError(() => error);
        }));
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isRefreshingSubject$.getValue()) {
            return this.isRefreshingSubject$.pipe(
                filter((isRefreshing) => !isRefreshing),
                switchMap(() => this.spotifyTokenService.token$),
                switchMap((token) => {
                    if (token) {
                        return next.handle(this.getRequestWithAuthorizationHeader(req, token));
                    }

                    return next.handle(req);
                }),
                first());
        }

        this.isRefreshingSubject$.next(true);

        return this.spotifyTokenService.refreshAccessToken().pipe(
            switchMap((token) => {
                this.isRefreshingSubject$.next(false);
                if (token) {
                    return next.handle(this.getRequestWithAuthorizationHeader(req, token));
                }

                return next.handle(req);
            }),
            first());
    }

    private getRequestWithAuthorizationHeader(req: HttpRequest<any>, token: SpotifyToken) {
        return req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token.access_token)
        })
    }
}