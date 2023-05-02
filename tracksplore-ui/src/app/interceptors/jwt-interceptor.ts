import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwtToken = localStorage.getItem('id_token');
        if (jwtToken && !req.headers.has('Authorization')) {
            const clonedReq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + jwtToken)
            });

            return next.handle(clonedReq);
        }

        return next.handle(req);
    }

}