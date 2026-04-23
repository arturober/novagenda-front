import { Routes } from '@angular/router';
import { logoutActivateGuard } from './shared/guards/logout-activate-guard';
import { loginActivateGuard } from './shared/guards/login-activate-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
    canActivate: [logoutActivateGuard]
  },
  {
    path: 'tasks',
    loadChildren: () => import('./tasks/tasks.routes').then(m => m.tasksRoutes),
    canActivate: [loginActivateGuard]
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.routes').then(m => m.categoriesRoutes),
    canActivate: [loginActivateGuard]
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
