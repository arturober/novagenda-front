import { Component, inject, linkedSignal } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  MatDivider,
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TopBar } from '../../../shared/components/top-bar/top-bar';
import { NewCategoryDialog } from '../../dialogs/new-category-dialog/new-category-dialog';
import { Category } from '../../interfaces/category';
import { CategoriesService } from '../../services/categories-service';
import { MatCard } from '@angular/material/card';
import { ConfirmDialog } from '../../../shared/dialogs/confirm-dialog/confirm-dialog';
import { filter, switchMap } from 'rxjs';
import { TasksCategoryDialog } from '../../../tasks/dialogs/tasks-category-dialog/tasks-category-dialog';

@Component({
  selector: 'categories-page',
  imports: [
    TopBar,
    MatButton,
    MatList,
    MatListItem,
    MatIcon,
    MatIconButton,
    MatDivider,
    MatListItemLine,
    MatListItemTitle,
    MatBadge,
    MatMenu,
    MatMenuItem,
    MatMenuContent,
    MatMenuTrigger,
    MatCard,
  ],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
})
export class CategoriesPage {
  readonly #categoriesService = inject(CategoriesService);
  readonly #dialog = inject(MatDialog);

  categoriesResource = this.#categoriesService.getCategoriesResource(true);
  categories = linkedSignal(() =>
    this.categoriesResource.hasValue() ? this.categoriesResource.value().categories : [],
  );

  openNewCategoryDialog() {
    const newTaskDialog = this.#dialog.open(NewCategoryDialog);
    newTaskDialog.afterClosed().subscribe((category: Category | undefined) => {
      if (category) {
        this.categories.update((categories) => categories.concat(category));
      }
    });
  }

  editCategory(category: Category){
    const editCategoryDialog = this.#dialog.open(NewCategoryDialog, {
      data: category,
    });
    editCategoryDialog.afterClosed().subscribe((updatedCategory: Category | undefined) => {
      if (updatedCategory) {
        this.categories.update((categories) => categories.map((cat) => cat.id === updatedCategory?.id ? updatedCategory : cat));
      }
    });
  }

  deleteCategory(id: string) {
    this.#dialog
      .open(ConfirmDialog, {
        data: {
          title: 'Borrar categoría',
          text: 'Las tareas asignadas se quedarán sin categoría. ¿Estás seguro?',
        },
      })
      .afterClosed()
      .pipe(
        filter((resp) => resp),
        switchMap(() => this.#categoriesService.deleteCategory(id)),
      )
      .subscribe(() => this.categories.update((categories) => categories.filter((cat) => cat.id !== id)));
  }

  showTasks(category: Category){
    this.#dialog.open(TasksCategoryDialog, {
      data: category,
    });
  }
}
