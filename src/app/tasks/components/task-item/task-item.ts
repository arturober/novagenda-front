import { Component, inject, input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Task } from '../../interfaces/task';
import { MatIcon } from '@angular/material/icon';
import { DateIntlPipe } from '../../../shared/pipes/date-intl-pipe';
import { DateRelativePipe } from '../../../shared/pipes/date-relative-pipe';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'task-item',
  imports: [
    MatCard,
    MatIcon,
    DateIntlPipe,
    DateRelativePipe,
    MatIconButton,
    MatMenu,
    MatMenuContent,
    MatMenuItem,
    MatMenuTrigger,
    RouterLink,
  ],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  task = input.required<Task>();

  readonly #router = inject(Router);

  get frequency() {
    switch (this.task().rrule) {
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
  }

  goDetails() {
    this.#router.navigate(['/tasks', this.task().id]);
  }
}
