import { Routes } from '@angular/router';

export const tasksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/tasks-page/tasks-page').then((m) => m.TasksPage),
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('./components/task-list-page/task-list-page').then((m) => m.TaskListPage),
      },
      {
        path: 'today',
        loadComponent: () =>
          import('./components/task-today-page/task-today-page').then((m) => m.TaskTodayPage),
      },
      {
        path: 'week',
        loadComponent: () =>
          import('./components/task-week-page/task-week-page').then((m) => m.TaskWeekPage),
      },
      {
        path: 'month',
        loadComponent: () =>
          import('./components/task-month-page/task-month-page').then((m) => m.TaskMonthPage),
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
    ],
  },
];
