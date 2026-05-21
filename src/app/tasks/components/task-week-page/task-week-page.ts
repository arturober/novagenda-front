import { Component, computed, inject, linkedSignal, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { DateIntlPipe } from '../../../shared/pipes/date-intl-pipe';
import { FirstUppercasePipe } from '../../../shared/pipes/first-uppercase-pipe';
import { Task } from '../../interfaces/task';
import { TaskService } from '../../services/task-service';
import { TaskItem } from '../task-item/task-item';
import { TasksPage } from '../tasks-page/tasks-page';
import { MatBadge } from '@angular/material/badge';

@Component({
  selector: 'task-week-page',
  imports: [
    TaskItem,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    DateIntlPipe,
    FirstUppercasePipe,
    MatBadge,
  ],
  templateUrl: './task-week-page.html',
  styleUrl: './task-week-page.scss',
})
export class TaskWeekPage {
  readonly #taskService = inject(TaskService);
  readonly #tasksPage = inject(TasksPage);

  today = signal(new Date());
  weekStart = linkedSignal(() => {
    const d = new Date(this.today());
    d.setDate(d.getDate() - d.getDay() + 1);
    console.log('weekStart', d);
    return d;
  });
  weekEnd = computed(() => {
    const d = new Date(this.weekStart());
    d.setDate(d.getDate() + 6);
    console.log('weekEnd', this.weekStart());
    return d;
  });

  weekStringStart = computed(() => this.weekStart().toISOString().slice(0, 10));
  weekStringEnd = computed(() => this.weekEnd().toISOString().slice(0, 10));

  tasklistResource = this.#taskService.getTasksByDateResource(
    this.weekStringStart,
    this.weekStringEnd,
  );

  tasks = computed(() =>
    this.tasklistResource.hasValue() ? this.tasklistResource.value().tasks : [],
  );

  weekTasks: [Date, Signal<Task[]>][] = [];

  constructor() {
    this.#tasksPage.reloadTasksEvent$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.tasklistResource.reload());

    const start = this.weekStart();
    for (let i = 0; i <= 6; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      this.weekTasks.push([d, computed(() => this.getTasksForDay(i))]);
    }
  }

  private getTasksForDay(offset: number): Task[] {
    const d = new Date(this.weekStart());
    d.setDate(d.getDate() + offset);
    const dayStr = d.toISOString().slice(0, 10);

    if (!this.tasklistResource.hasValue() || !this.tasklistResource.value()) {
      return [];
    }

    const allTasks = this.tasklistResource.value()!.tasks || [];

    return allTasks.reduce<Task[]>((acc, task) => {
      const startsOnDay = task.startDate === dayStr;

      const inRange =
        !!task.startDate && !!task.endDate && task.startDate <= dayStr && task.endDate >= dayStr;

      const isDailyRecurrence =
        !!task.startDate && task.startDate < dayStr && task.rrule === 'FREQ=DAILY';

      if (startsOnDay || inRange) {
        acc.push(task);
      } else if (isDailyRecurrence) {
        acc.push({
          ...task,
          startDate: dayStr,
        });
      }

      return acc;
    }, []);
  }
}
