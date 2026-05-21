import { Component, computed, inject, input } from '@angular/core';
import { Task } from '../../interfaces/task';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TaskItem } from '../../components/task-item/task-item';
import { DateIntlPipe } from '../../../shared/pipes/date-intl-pipe';

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

  close(): void {
    this.#dialogRef.close();
  }
}
