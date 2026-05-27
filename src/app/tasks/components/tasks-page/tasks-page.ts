import { Component, effect, inject, input } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { AdaptativeTabs } from '../../../shared/components/adaptative-tabs/adaptative-tabs';
import { TopBar } from '../../../shared/components/top-bar/top-bar';
import { NewTaskDialog } from '../../dialogs/new-task-dialog/new-task-dialog';

@Component({
  selector: 'tasks-page',
  imports: [MatIcon, AdaptativeTabs, MatFabButton, RouterOutlet, TopBar],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.css',
})
export class TasksPage {
  readonly #dialog = inject(MatDialog);
  readonly #router = inject(Router);
  category = input<string>();

  readonly #reloadTasksEvent$ = new Subject<void>();

  get reloadTasksEvent$() {
    return this.#reloadTasksEvent$.asObservable();
  }

  constructor() {
    effect(() => {
      const category = this.category();
      if (category) {
        console.log(category);
      }
    });
  }

  openNewTaskDialog() {
    const newTaskDialog = this.#dialog.open(NewTaskDialog);
    newTaskDialog.afterClosed().subscribe((created) => {
      if (created) {
        this.#reloadTasksEvent$.next();
        this.#router.navigate(['/tasks', 'list']);
      }
    });
  }
}
