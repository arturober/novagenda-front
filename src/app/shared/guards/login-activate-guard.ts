import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../auth/services/auth-service';

export const loginActivateGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const url = router.currentNavigation()?.initialUrl.toString();
  if (url && !url.startsWith('/auth')) {
    authService.redirectAfterLogin.set(url);
  }
  return authService.isLogged().pipe(map((v) => v || router.createUrlTree(['/auth', 'login'])));
};
