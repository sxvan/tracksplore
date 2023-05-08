import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { CredentialsModel } from "../models/credentials-model";
import { AuthenticateModel } from "../models/authenticate-model";
import { BehaviorSubject, Observable, first, switchMap, tap } from "rxjs";
import { UserModel } from "../models/user-model";
import { UserService } from "./user.service";

@Injectable()

export class AuthenticationService {
    private readonly userSubject$: BehaviorSubject<UserModel | undefined> = new BehaviorSubject<UserModel | undefined>(undefined);
    user$: Observable<UserModel | undefined> = this.userSubject$.asObservable();

    constructor(private http: HttpClient, private userService: UserService) {
        this.userService.get().pipe(
            tap((userModel) => {
                this.userSubject$.next(userModel);
            }),
            first()
        ).subscribe();
    }

    authenticate(model: CredentialsModel): Observable<AuthenticateModel> {
        return this.http.post<AuthenticateModel>("https://localhost:7192/api/Authentication", model).pipe(
            tap((authModel) => {
                 this.setJwtToken(authModel.token);
                 this.userSubject$.next(authModel.user);
                }));
    }

    signOut() {
        this.clearSession();
    }

    get isAuthenticated(): boolean {
        return this.getJwtToken() != null;
    }

    public getJwtToken() {
        return localStorage.getItem('id_token');
    }

    private setJwtToken(jwtToken: string): void {
        localStorage.setItem('id_token', jwtToken);
    }

    private clearSession(): void {
        localStorage.removeItem('id_token');
        this.userSubject$.next(undefined);
    }
}