import { Component, DestroyRef, inject, signal } from '@angular/core';
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
import { ProfileService } from '../../services/profile-service';
import { NewTaskDialog } from '../../../tasks/dialogs/new-task-dialog/new-task-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'edit-name',
  imports: [MatDialogTitle, MatDialogContent, MatFormField, MatButton, MatLabel, MatDialogActions, FormField, MatDialogClose, MatInput],
  templateUrl: './edit-name.html',
  styleUrl: './edit-name.scss',
})
export class EditName {
  readonly name = inject<string>(MAT_DIALOG_DATA);
  readonly #profileService = inject(ProfileService);
  readonly #dialogRef = inject(MatDialogRef<NewTaskDialog>);
  readonly #destroyRef = inject(DestroyRef);
  readonly #snackBar = inject(MatSnackBar);

  readonly nameField = form(signal(this.name), (name) => {
    required(name);
  });

  saveName() {
    this.#profileService
      .updateName(this.nameField().value())
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        finalize(() => this.#dialogRef.close(true)),
      )
      .subscribe({
        next: () => {
          this.#snackBar.open('Nombre actualizado', 'Cerrar', {
            duration: 2000,
            panelClass: 'success',
          });
        },
        error: (err) =>
          this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          }),
      });
  }
}
