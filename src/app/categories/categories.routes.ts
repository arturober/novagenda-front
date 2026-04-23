import { Routes } from '@angular/router';

export const categoriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/categories-page/categories-page').then((m) => m.CategoriesPage),
  },
];
