import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams, HttpEvent } from '@angular/common/http';
import { take, exhaustMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRoot from '../store/root.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private store: Store<fromRoot.State>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('auth').pipe(take(1), map(authState => authState.user), exhaustMap(user => {
            if (!user) {
                return next.handle(req);
            }
            const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
            return next.handle(modifiedReq);
        }));
    }
}
