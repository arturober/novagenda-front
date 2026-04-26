import { Routes } from '@angular/router';

export const invitationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/invitations-page/invitations-page').then((m) => m.InvitationsPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./components/invitations-page/invitations-page').then((m) => m.InvitationsPage),
  },
];
