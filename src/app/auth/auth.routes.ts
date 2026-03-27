import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login-page/login-page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register-page/register-page').then(m => m.RegisterPage)
  },
  {
    path: '**',
    redirectTo: 'login'
  },
];
