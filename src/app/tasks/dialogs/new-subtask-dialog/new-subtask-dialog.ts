import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubtaskInsert } from '../../interfaces/subtask';
import { TaskService } from '../../services/task-service';
import { NewTaskDialog } from '../new-task-dialog/new-task-dialog';

@Component({
  selector: 'new-subtask-dialog',
  imports: [
    MatDialogClose,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatFormField,
    MatLabel,
    FormField,
    MatInput,
  ],
  templateUrl: './new-subtask-dialog.html',
  styleUrl: './new-subtask-dialog.scss',
})
export class NewSubtaskDialog {
  readonly #taskService = inject(TaskService);
  readonly #dialogRef = inject(MatDialogRef<NewTaskDialog>);
  readonly #destroyRef = inject(DestroyRef);
  readonly #snackBar = inject(MatSnackBar);
  readonly taskId = inject<string>(MAT_DIALOG_DATA);

  subtaskModel = signal<SubtaskInsert>({
    description: '',
  });

  subtaskForm = form(this.subtaskModel, (schema) => {
    required(schema.description);
  });

  addTask() {
    this.#taskService
      .insertSubtask(this.taskId, this.subtaskModel())
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: (resp) => this.#dialogRef.close(resp.subtask),
        error: (err) => {
          this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          });
          this.#dialogRef.close();
        }
      });
  }
}
