import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    kind: string
}

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor(private http: HttpClient) {}

    signup(email: string, password: string) {
        return this.http.post(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAXZitVV7YKGVrkYM7MGylD2L-9uz-JRjw', 
            {
                email,
                password,
                returnSecureToken: true
            }
        )
    }
}