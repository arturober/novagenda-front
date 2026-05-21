import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { DateIntlPipe } from '../../../shared/pipes/date-intl-pipe';
import { FirstUppercasePipe } from '../../../shared/pipes/first-uppercase-pipe';
import { TaskService } from '../../services/task-service';
import { TaskItem } from '../task-item/task-item';
import { TasksPage } from '../tasks-page/tasks-page';
import { Platform } from '@angular/cdk/platform';

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
    MatDatepicker,
    FormField,
    MatDatepickerInput,
  ],
  templateUrl: './task-today-page.html',
  styleUrl: './task-today-page.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, provideNativeDateAdapter()],
})
export class TaskTodayPage {
  readonly #taskService = inject(TaskService);
  readonly #tasksPage = inject(TasksPage);
  readonly platform = inject(Platform);

  isMobileOS = this.platform.IOS || this.platform.ANDROID;

  date = signal(new Date());
  dateString = computed(() => this.date().toISOString().slice(0, 10));

  dateField = form(this.date);

  tasklistResource = this.#taskService.getTasksByDateResource(this.dateString, this.dateString);
  tasks = computed(() =>
    this.tasklistResource.hasValue()
      ? this.tasklistResource
          .value()
          .tasks.filter(
            (t) =>
              t.startDate === this.dateString() ||
              (t.startDate! <= this.dateString() && t.endDate && t.endDate >= this.dateString()),
          )
      : [],
  );

  constructor() {
    this.#tasksPage.reloadTasksEvent$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.tasklistResource.reload());

    effect(() => console.log(this.date()));
  }

  nextDay() {
    this.date.update((d) => new Date(d.setDate(d.getDate() + 1)));
  }

  prevDay() {
    this.date.update((d) => new Date(d.setDate(d.getDate() - 1)));
  }
}
