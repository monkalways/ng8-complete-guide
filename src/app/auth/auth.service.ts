import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    kind: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAXZitVV7YKGVrkYM7MGylD2L-9uz-JRjw',
            {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAXZitVV7YKGVrkYM7MGylD2L-9uz-JRjw',
            {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    autoLogin() {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            return;
        }
        const userDataJson = JSON.parse(userData);
        const user = new User(userDataJson.email, userDataJson.id, userDataJson._token, new Date(userDataJson._tokenExpirationDate));
        if (user.token) {
            const expirationDuration = new Date(userDataJson._tokenExpirationDate).getTime() - new Date().getTime();
            if(expirationDuration <= 0) {
                this.logout();
            } else {
                this.autoLogout(expirationDuration);
                this.user.next(user);
            }
        }
    }

    private handleAuthentication(email: string, id: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + + expiresIn * 1000);
        const user = new User(email, id, token, expirationDate);
        this.user.next(user);

        localStorage.setItem('userData', JSON.stringify(user));
        this.autoLogout(expiresIn * 1000);
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is invalid';
                break;
            case 'USER_DISABLED':
                    errorMessage = 'This user is disabled';
        }
        return throwError(errorMessage);
    }
}
