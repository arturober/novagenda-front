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
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

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
    MatCard,
    MatCardTitle,
    MatIcon,
    MatIconButton,
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
    return d;
  });
  weekEnd = computed(() => {
    const d = new Date(this.weekStart());
    d.setDate(d.getDate() + 6);
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

  weekTasks: [Signal<Date>, Signal<Task[]>][] = [];

  constructor() {
    this.#tasksPage.reloadTasksEvent$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.tasklistResource.reload());

    for (let i = 0; i <= 6; i++) {
      this.weekTasks.push([
        computed(() => {
          const d = new Date(this.weekStart());
          d.setDate(d.getDate() + i);
          return d;
        }),
        computed(() => this.getTasksForDay(i)),
      ]);
    }
  }

  private getTasksForDay(offset: number): Task[] {
    if (!this.tasklistResource.hasValue() || !this.tasklistResource.value()) {
      return [];
    }

    const d = new Date(this.weekStart());
    d.setDate(d.getDate() + offset);
    const dayStr = d.toISOString().slice(0, 10);

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
        if (
          !task.interactions.some(
            (interaction) => interaction.occurrenceDate.slice(0, 10) === dayStr,
          )
        ) {
          acc.push({
            ...task,
            startDate: dayStr,
          });
        }
      }

      return acc;
    }, []);
  }

  prevWeek() {
    this.weekStart.update((d) => {
      const date = new Date(d);
      date.setDate(date.getDate() - 7);
      return date;
    });
  }

  nextWeek() {
    this.weekStart.update((d) => {
      const date = new Date(d);
      date.setDate(date.getDate() + 7);
      return date;
    });
  }
}
