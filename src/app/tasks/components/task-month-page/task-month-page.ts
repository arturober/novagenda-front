import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { TasksPage } from '../tasks-page/tasks-page';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Task } from '../../interfaces/task';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FirstUppercasePipe } from '../../../shared/pipes/first-uppercase-pipe';
import { MatDialog } from '@angular/material/dialog';
import { TasksDayDialog } from '../../dialogs/tasks-day-dialog/tasks-day-dialog';

@Component({
  selector: 'task-month-page',
  imports: [MatCard, MatCardContent, MatCardTitle, MatIconButton, MatIcon, FirstUppercasePipe],
  templateUrl: './task-month-page.html',
  styleUrl: './task-month-page.scss',
})
export class TaskMonthPage {
  readonly #taskService = inject(TaskService);
  readonly #tasksPage = inject(TasksPage);
  readonly #dialog = inject(MatDialog);

  today = signal(new Date());

  monthStart = linkedSignal(() => {
    const d = new Date(this.today());
    d.setDate(1);
    return d;
  });

  monthEnd = computed(() => {
    const d = new Date(this.monthStart());
    d.setMonth(d.getMonth() + 1);
    d.setDate(0); // Último día del mes actual
    return d;
  });

  gridStart = computed(() => {
    const start = new Date(this.monthStart());
    const dayOfWeek = start.getDay();
    const daysToSubtract = (dayOfWeek + 6) % 7; // Ajustar a Lunes como primer día de la semana
    start.setDate(start.getDate() - daysToSubtract);
    return start;
  });

  gridEnd = computed(() => {
    const end = new Date(this.gridStart());
    end.setDate(end.getDate() + 41); // 42 días en total (6 semanas)
    return end;
  });

  monthStringStart = computed(() => this.gridStart().toISOString().slice(0, 10));

  monthStringEnd = computed(() => this.gridEnd().toISOString().slice(0, 10));

  tasklistResource = this.#taskService.getTasksByDateResource(
    this.monthStringStart,
    this.monthStringEnd,
  );

  tasks = computed(() =>
    this.tasklistResource.hasValue() ? this.tasklistResource.value().tasks : [],
  );

  monthName = computed(() => {
    return this.monthStart().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  });

  daysInGrid = computed(() => {
    const days: {
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
      dayString: string;
      tasks: Task[];
    }[] = [];

    const start = new Date(this.gridStart());
    const currentMonth = this.monthStart().getMonth();

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dayString = `${year}-${month}-${day}`;

      days.push({
        date: d,
        isCurrentMonth: d.getMonth() === currentMonth,
        isToday: dayString === todayStr,
        dayString,
        tasks: this.getTasksForDate(dayString),
      });
    }

    return days;
  });

  constructor() {
    this.#tasksPage.reloadTasksEvent$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.tasklistResource.reload());
  }

  private getTasksForDate(dayStr: string): Task[] {
    const allTasks = this.tasks();
    return allTasks.reduce<Task[]>((acc, task) => {
      const startsOnDay = task.startDate === dayStr;

      const inRange =
        !!task.startDate && !!task.endDate && task.startDate <= dayStr && task.endDate >= dayStr;

      const isDailyRecurrence =
        !!task.startDate && task.startDate < dayStr && task.rrule === 'FREQ=DAILY';

      const startDay = new Date(task.startDate!);
      const currentDay = new Date(dayStr);
      const diffDays = (currentDay.getTime() - startDay.getTime()) / 1000 / 60 / 60 / 24;
      const isWeeklyRecurrence =
        !!task.startDate &&
        task.startDate < dayStr &&
        diffDays % 7 === 0 &&
        task.rrule === 'FREQ=WEEKLY';

      if (startsOnDay || inRange) {
        acc.push(task);
      } else if (isDailyRecurrence || isWeeklyRecurrence) {
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

  prevMonth() {
    this.monthStart.update((d) => {
      const date = new Date(d);
      date.setMonth(date.getMonth() - 1);
      return date;
    });
  }

  nextMonth() {
    this.monthStart.update((d) => {
      const date = new Date(d);
      date.setMonth(date.getMonth() + 1);
      return date;
    });
  }

  onDayClick(day: { date: Date; tasks: Task[] }) {
    const dialogRef = this.#dialog.open(TasksDayDialog, {
      data: day,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.tasklistResource.reload();
    });
  }
}
