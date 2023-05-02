import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticateModel } from "../models/authenticate-model";
import { JwtTokenModel } from "../models/jtw-token-model";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    constructor(private http: HttpClient) {
        
    }

    async authenticate(model: AuthenticateModel) {
        const jwtToken = await lastValueFrom(this.http.post<JwtTokenModel>("https://localhost:7192/api/Authentication", model));
        this.setSession(jwtToken.token);
    }

    get isAuthenticated(): boolean {
        return this.getToken() != null;
    }

    signOut() {
        this.clearSession();
    }

    private getToken() {
        return localStorage.getItem('id_token');
    }

    private setSession(token: string): void {
        localStorage.setItem('id_token', token);
    }

    private clearSession(): void {
        localStorage.removeItem('id_token');
    }
}