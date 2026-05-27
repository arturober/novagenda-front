import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DateIntlPipe } from '../../../shared/pipes/date-intl-pipe';
import { TaskItem } from '../../components/task-item/task-item';
import { Task } from '../../interfaces/task';

@Component({
  selector: 'tasks-day-dialog',
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    MatDialogClose,
    MatButton,
    TaskItem,
    DateIntlPipe,
  ],
  templateUrl: './tasks-day-dialog.html',
  styleUrl: './tasks-day-dialog.scss',
})
export class TasksDayDialog {
  readonly #dialogRef = inject(MatDialogRef<TasksDayDialog>);
  readonly data = inject<{ date: Date; tasks: Task[] }>(MAT_DIALOG_DATA);

  tasks = signal<Task[]>(this.data.tasks);

  close(): void {
    this.#dialogRef.close();
  }

  removeTask(task: Task): void {
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== task.id));
  }
}
