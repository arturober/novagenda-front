import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';

export const IS_LOCAL = new HttpContextToken<boolean>(() => false);

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const serverUrl = isDevMode()
    ? 'http://localhost:3000'
    : 'https://api.fullstackpro.es/novagenda-back';

  if(!req.url.startsWith('http') && !req.url.startsWith('/') && !req.context.has(IS_LOCAL)) {
    const clonedReq = req.clone({
      url: `${serverUrl}/${req.url}`
    })
    return next(clonedReq);
  }
  return next(req);
};
