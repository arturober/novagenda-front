import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { TaskInsert } from '../../interfaces/task';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'new-task-dialog',
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
  templateUrl: './new-task-dialog.html',
  styleUrl: './new-task-dialog.scss',
})
export class NewTaskDialog {
  readonly #taskService = inject(TaskService);
  readonly #dialogRef = inject(MatDialogRef<NewTaskDialog>);
  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);
  readonly #snackBar = inject(MatSnackBar);

  taskModel = signal<TaskInsert>({
    title: '',
  });

  taskForm = form(this.taskModel, (schema) => {
    required(schema.title);
  });

  addTask() {
    this.#taskService
      .insertTask(this.taskModel())
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        finalize(() => this.#dialogRef.close(true)),
      )
      .subscribe({
        error: (err) =>
          this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          }),
      });
  }

  openNewTaskPage() {
    this.#router.navigate(['/tasks', 'add'], {
      state: { title: this.taskModel().title },
    });
  }
}
