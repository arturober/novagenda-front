import { Component, inject, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { DateIntlPipe } from '../../../shared/pipes/date-intl-pipe';
import { DateRelativePipe } from '../../../shared/pipes/date-relative-pipe';
import { Task } from '../../interfaces/task';

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
  ],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  task = input.required<Task>();
  navigationTriggered = output<void>();

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
    this.navigationTriggered.emit();
    this.#router.navigate(['/tasks', this.task().id]);
  }
}
