import { Component, computed, inject, signal } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { TaskService } from '../../services/task-service';
import { TaskItem } from '../task-item/task-item';
import { TasksPage } from '../tasks-page/tasks-page';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'task-list-page',
  imports: [
    TaskItem,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
  ],
  templateUrl: './task-list-page.html',
  styleUrl: './task-list-page.scss',
})
export class TaskListPage {
  readonly #taskService = inject(TaskService);
  readonly #tasksPage = inject(TasksPage);

  tasklistResource = this.#taskService.getTasksResource();
  tasks = computed(() =>
    this.tasklistResource.hasValue() ? this.tasklistResource.value().tasks : [],
  );

  pendingExpanded = signal(true);

  constructor() {
    this.#tasksPage.reloadTasksEvent$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.tasklistResource.reload());
  }
}
