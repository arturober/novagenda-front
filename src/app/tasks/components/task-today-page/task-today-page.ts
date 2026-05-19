import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { DateIntlPipe } from '../../../shared/pipes/date-intl-pipe';
import { FirstUppercasePipe } from '../../../shared/pipes/first-uppercase-pipe';
import { TaskService } from '../../services/task-service';
import { TaskItem } from '../task-item/task-item';
import { TasksPage } from '../tasks-page/tasks-page';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'task-today-page',
  imports: [
    TaskItem,
    DateIntlPipe,
    MatCard,
    MatCardContent,
    MatCardTitle,
    FirstUppercasePipe,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './task-today-page.html',
  styleUrl: './task-today-page.scss',
})
export class TaskTodayPage {
  readonly #taskService = inject(TaskService);
  readonly #tasksPage = inject(TasksPage);
  date = signal(new Date());
  dateString = computed(() => this.date().toISOString().slice(0, 10));

  tasklistResource = this.#taskService.getTasksByDateResource(this.dateString, this.dateString);
  tasks = computed(() =>
    this.tasklistResource.hasValue() ? this.tasklistResource.value().tasks : [],
  );

  constructor() {
    this.#tasksPage.reloadTasksEvent$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.tasklistResource.reload());
  }

  nextDay() {
    this.date.update(d => new Date(d.setDate(d.getDate() + 1)));
  }

  prevDay() {
    this.date.update(d => new Date(d.setDate(d.getDate() - 1)));

  }
}
