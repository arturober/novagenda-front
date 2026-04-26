import { Component, computed, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
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
import { Task, TaskListResponse } from '../../interfaces/task';

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

  pendingNoDateExpanded = signal(true);
  pendingDateExpanded = signal(true);
  overdueExpanded = signal(false);
  completedExpanded = signal(false);

  loadOverdue = signal(false);
  overduePage = signal(1);
  loadCompleted = signal(false);
  completedPage = signal(1);

  tasklistResource = this.#taskService.getTasksResource();
  tasks = computed(() =>
    this.tasklistResource.hasValue() ? this.tasklistResource.value().tasks : [],
  );
  taskNoDate = computed(() => this.tasks().filter((t) => t.startDate === null));
  taskDate = computed(() => this.tasks().filter((t) => t.startDate !== null));

  tasksOverdueResource = this.#taskService.getOverdueTasksResource(
    this.loadOverdue,
    this.overduePage,
  );
  tasksCompletedResource = this.#taskService.getCompletedTasksResource(
    this.loadCompleted,
    this.completedPage,
  );

  tasksOverdue = linkedSignal<TaskListResponse | undefined, Task[]>({
    source: () => this.tasksOverdueResource?.value(),
    computation: (resp, previous) => {
      if (!resp) return previous?.value ?? [];
      return this.overduePage() > 1 && previous ? previous.value.concat(resp!.tasks) : resp?.tasks;
    },
  });

  tasksCompleted = linkedSignal<TaskListResponse | undefined, Task[]>({
    source: () => this.tasksCompletedResource?.value(),
    computation: (resp, previous) => {
      if (!resp) return previous?.value ?? [];
      return this.overduePage() > 1 && previous ? previous.value.concat(resp!.tasks) : resp?.tasks;
    },
  });

  constructor() {
    this.#tasksPage.reloadTasksEvent$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.tasklistResource.reload());

    effect(() => {
      const overdueExpanded = this.overdueExpanded();
      untracked(() => {
        if(overdueExpanded) {
          this.loadOverdue.set(true);
        }
      });
    });

    effect(() => {
      const completedExpanded = this.completedExpanded();
      untracked(() => {
        if(completedExpanded) {
          this.loadCompleted.set(true);
        }
      });
    });
  }
}
