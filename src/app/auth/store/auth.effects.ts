import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
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

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + + expiresIn * 1000);
  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate
  });
};

const handleError = errorRes => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthActions.AuthenticateFail(errorMessage));
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
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
        {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
        }
      ).pipe(map(resData => {
        return handleAuthentication(
          +resData.expiresIn,
          resData.email,
          resData.localId,
          resData.idToken);
      }), catchError(errorRes => {
        return handleError(errorRes);
      }));
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
        {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
        }
      ).pipe(map(resData => {
        return handleAuthentication(
          +resData.expiresIn,
          resData.email,
          resData.localId,
          resData.idToken);
      }), catchError(errorRes => {
        return handleError(errorRes);
      }));
    })
  );

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
}
