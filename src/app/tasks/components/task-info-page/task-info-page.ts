import { Component, computed, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatList,
  MatListItem,
  MatListItemIcon,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import { Router } from '@angular/router';
import { DateIntlPipe } from '../../../shared/pipes/date-intl-pipe';
import { TimeIntlPipe } from '../../../shared/pipes/time-intl-pipe';
import { TaskService } from '../../services/task-service';
import { TaskDetailsPage } from '../task-details-page/task-details-page';
import { DeleteTaskAction } from '../../directives/delete-task-action';

@Component({
  selector: 'task-info-page',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatListItemLine,
    MatListItemTitle,
    MatIcon,
    MatButton,
    DateIntlPipe,
    TimeIntlPipe,
    DeleteTaskAction,
  ],
  templateUrl: './task-info-page.html',
  styleUrl: './task-info-page.scss',
})
export class TaskInfoPage {
  occurrenceDate = input<string>();

  readonly #taskDetailsPage = inject(TaskDetailsPage);
  readonly #taskService = inject(TaskService);
  readonly #router = inject(Router);
  task = this.#taskDetailsPage.task;
  date = computed(() => this.occurrenceDate() || this.task()?.startDate);

  priorityLabel = computed(() => {
    switch (this.task()?.priority) {
      case 'LOW':
        return 'Baja';
      case 'MEDIUM':
        return 'Media';
      case 'HIGH':
        return 'Alta';
      default:
        return '';
    }
  });

  priorityColorClass = computed(() => {
    switch (this.task()?.priority) {
      case 'LOW':
        return 'text-green-800 dark:text-green-200';
      case 'MEDIUM':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'HIGH':
        return 'text-red-800 dark:text-red-200';
      default:
        return '';
    }
  });

  statusColorClass = computed(() => {
    if (this.task()?.deletedAt) {
      return 'text-red-800 dark:text-red-200';
    } else if (!this.task()?.isActive) {
      return 'text-green-800 dark:text-green-200';
    } else if (this.pending()) {
      return 'text-indigo-800 dark:text-indigo-200';
    } else {
      return 'text-red-800 dark:text-red-200';
    }
  });

  frequency = computed(() => {
    switch (this.task()?.rrule) {
      case 'FREQ=DAILY':
        return 'Diario';
      case 'FREQ=WEEKLY':
        return 'Semanal';
      case 'FREQ=MONTHLY':
        return 'Mensual';
      case 'FREQ=YEARLY':
        return 'Anual';
      default:
        return '';
    }
  });

  pending = computed(() => {
    const task = this.task();
    if (!task || !task.startDate) {
      return true;
    } else if (task.startDate && !task.endDate) {
      const time = task.startTime ? `T${task.startTime}` : 'T23:59:59';
      const date = this.occurrenceDate() ?? task.startDate;
      return new Date() <= new Date(date + time);
    } else if (task.endDate) {
      return new Date() <= new Date(task.endDate + 'T23:59:59');
    }
    return false;
  });

  complete() {
    if (!this.task()) return;

    this.#taskService
      .completeTask(this.task()!.id, true, this.task()!.startDate ?? undefined)
      .subscribe(() => {
        this.task.update((t) => ({ ...t!, isActive: false }));
      });
  }

  uncomplete() {
    if (!this.task()) return;

    this.#taskService
      .completeTask(this.task()!.id, false, this.task()!.startDate ?? undefined)
      .subscribe(() => {
        this.task.update((t) => ({ ...t!, isActive: true }));
      });
  }

  goEdit() {
    if (!this.task()) return;
    this.#router.navigate(['/tasks', 'edit', this.task()!.id]);
  }

  goBack() {
    this.#router.navigate(['/tasks']);
  }
}
