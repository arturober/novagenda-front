import { isPlatformBrowser } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs';
import { TokenResponse } from '../../auth/interfaces/responses';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const platformId = inject(PLATFORM_ID);

  const accessToken = isPlatformBrowser(platformId) ? localStorage.getItem('accessToken') : null;

  if (accessToken && !req.url?.includes('auth/refresh') && !req.url?.includes('auth/logout')) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });

    return next(authReq).pipe(
      catchError((e) => {
        if (
          e instanceof HttpErrorResponse &&
          e.status === HttpStatusCode.Unauthorized &&
          !e.url?.includes('auth/refresh')
        ) {
          const refreshToken = localStorage.getItem('refreshToken');
          const idRefresh = localStorage.getItem('idRefresh');
          if (refreshToken && idRefresh) {
            return http
              .post<TokenResponse>(
                'auth/refresh',
                { idRefresh },
                { headers: { Authorization: `Bearer ${refreshToken}` } }
              )
              .pipe(
                switchMap((r) => {
                  localStorage.setItem('accessToken', r.accessToken);
                  localStorage.setItem('refreshToken', r.refreshToken);
                  localStorage.setItem('idRefresh', r.idRefresh);
                  const authReq = req.clone({
                    headers: req.headers.set(
                      'Authorization',
                      `bearer ${r.accessToken}`
                    ),
                  });
                  return next(authReq);
                })
              );
          }
        }
        throw e;
      })
    );
  }
  return next(req);
};