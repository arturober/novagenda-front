import { Routes } from '@angular/router';

export const tasksRoutes: Routes = [
  {
    path: 'add',
    loadComponent: () =>
      import('./components/task-form-page/task-form-page').then((m) => m.TaskFormPage),
  },
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
        pathMatch: 'full',
      },
    ],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/task-details-page/task-details-page').then((m) => m.TaskDetailsPage),
    children: [
      {
        path: 'info',
        loadComponent: () =>
          import('./components/task-info-page/task-info-page').then((m) => m.TaskInfoPage),
      },
      {
        path: 'colab',
        loadComponent: () =>
          import('./components/task-colab-page/task-colab-page').then((m) => m.TaskColabPage),
      },
      {
        path: 'subtasks',
        loadComponent: () =>
          import('./components/task-subtasks-page/task-subtasks-page').then((m) => m.TaskSubtasksPage),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import('./components/task-comments-page/task-comments-page').then((m) => m.TaskCommentsPage),
      },
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full',
      },
    ],
  },
];
