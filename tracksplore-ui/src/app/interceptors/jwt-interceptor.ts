import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.url.includes('localhost:7192/api')) {
            return next.handle(req);
        }

        const jwtToken = localStorage.getItem('id_token');
        if (!jwtToken) {
            return next.handle(req);
        }

        const clonedReq = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + jwtToken)
        });

        return next.handle(clonedReq);
    }

}