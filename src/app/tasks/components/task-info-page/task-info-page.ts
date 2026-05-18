import { Component, computed, inject } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatList,
  MatListItem,
  MatListItemIcon,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import { TaskDetailsPage } from '../task-details-page/task-details-page';
import { DateIntlPipe } from '../../../shared/pipes/date-intl-pipe';
import { TimeIntlPipe } from '../../../shared/pipes/time-intl-pipe';
import { MatButton } from '@angular/material/button';

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
  ],
  templateUrl: './task-info-page.html',
  styleUrl: './task-info-page.scss',
})
export class TaskInfoPage {
  readonly #taskDetailsPage = inject(TaskDetailsPage);
  task = this.#taskDetailsPage.task;

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
    if(!this.task()?.isActive) {
        return 'text-green-800 dark:text-green-200';
      } else if(this.pending()) {
        return 'text-cyan-800 dark:text-cyan-200';
      } else {
        return 'text-red-800 dark:text-red-200';
      }
  })

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
    if(!task || !task.startDate) {
      return true;
    } else if(task.startDate && !task.endDate) {
      const time = task.startTime ? `T${task.startTime}` : 'T23:59:59';
      return new Date() <= new Date(task.startDate + time);
    } else if(task.endDate) {
      return new Date() <= new Date(task.endDate + 'T23:59:59');
    }
    return false;
  });
}
