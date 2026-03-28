import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../auth/services/auth-service';

export const logoutActivateGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService
    .isLogged()
    .pipe(map(v => !v || router.createUrlTree(['/tasks'])));
};
