import { Component, inject, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { DateIntlPipe } from '../../../shared/pipes/date-intl-pipe';
import { DateRelativePipe } from '../../../shared/pipes/date-relative-pipe';
import { DeleteTaskAction } from '../../directives/delete-task-action';
import { Task } from '../../interfaces/task';
import { TaskService } from '../../services/task-service';

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
    DeleteTaskAction,
  ],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  task = input.required<Task>();
  navigationTriggered = output<void>();
  completed = output<boolean>();
  deleted = output<void>();

  readonly #router = inject(Router);
  readonly #taskService = inject(TaskService);

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
    this.#router.navigate(['/tasks', this.task().id], {
      queryParams: { occurrenceDate: this.task().startDate },
    });
  }

  goEdit() {
    this.navigationTriggered.emit();
    this.#router.navigate(['/tasks', 'edit', this.task().id]);
  }

  complete() {
    this.#taskService
      .completeTask(this.task().id, true, this.task().startDate ?? undefined)
      .subscribe(() => {
        this.completed.emit(true);
      });
  }

  uncomplete() {
    this.#taskService.completeTask(this.task().id, false).subscribe(() => {
      this.completed.emit(false);
    });
  }
}
