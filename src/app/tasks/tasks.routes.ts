import { Routes } from '@angular/router';

export const tasksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/tasks-page/tasks-page').then(m => m.TasksPage),
    children: [

    ]
  },
];
