import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { SingleUserResponse, TokenResponse } from '../interfaces/responses';
import { isPlatformBrowser } from '@angular/common';
import { UserLogin, UserRegister } from '../interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #router = inject(Router);

  #logged = signal(false);
  redirectAfterLogin = signal('/tasks');

  #platformId = inject(PLATFORM_ID);

  #loggedUserResource = httpResource<SingleUserResponse>(() =>
    this.#logged() ? 'users/profile/mine' : undefined,
  );

  get logged() {
    return this.#logged.asReadonly();
  }

  get loggedUserResource() {
    return this.#loggedUserResource.asReadonly();
  }

  reloadUser() {
    this.#loggedUserResource.reload();
  }

  login(userLogin: UserLogin, firebaseToken?: string): Observable<void> {
    return this.#http.post<TokenResponse>('auth/login', { ...userLogin, firebaseToken }).pipe(
      map((r) => {
        localStorage.setItem('accessToken', r.accessToken);
        localStorage.setItem('refreshToken', r.refreshToken);
        localStorage.setItem('idRefresh', r.idRefresh);

        this.#logged.set(true);
      }),
    );
  }

  register(userRegister: UserRegister): Observable<void> {
    return this.#http.post<void>('auth/register', userRegister);
  }

  loginGoogle(token: string, firebaseToken?: string): Observable<void> {
    return this.#http
      .post<TokenResponse>('auth/google', {
        token,
        firebaseToken,
      })
      .pipe(
        map((r) => {
          localStorage.setItem('accessToken', r.accessToken);
          localStorage.setItem('refreshToken', r.refreshToken);
          localStorage.setItem('idRefresh', r.idRefresh);

          this.#logged.set(true);
        }),
      );
  }

  logout(): Observable<void> {
    const refreshToken = localStorage.getItem('refreshToken');

    return this.#http
      .post<void>(
        'auth/logout',
        {
          idRefresh: localStorage.getItem('idRefresh'),
        },
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
        },
      )
      .pipe(
        tap(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('idRefresh');
          this.#logged.set(false);
        }),
      );
  }

  isLogged(): Observable<boolean> {
    if (this.logged()) {
      return of(true);
    }

    const accessToken = isPlatformBrowser(this.#platformId)
      ? localStorage.getItem('accessToken')
      : null;

    if (!accessToken) {
      return of(false);
    }

    return this.#http.get<void>('auth/validate').pipe(
      map(() => {
        this.#logged.set(true);
        return true;
      }),
      catchError(() => of(false)),
    );
  }

  navigateAfterLogin() {
    this.#router.navigateByUrl(this.redirectAfterLogin());
    this.redirectAfterLogin.set('/tasks');
  }
}
