import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormField, form, required, validate } from '@angular/forms/signals';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatLabel, MatInput, MatSuffix, MatError, MatPrefix } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { NewTaskDialog } from '../../../tasks/dialogs/new-task-dialog/new-task-dialog';
import { ProfileService } from '../../services/profile-service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'edit-password',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatButton,
    MatLabel,
    MatDialogActions,
    FormField,
    MatDialogClose,
    MatInput,
    MatSuffix,
    MatPrefix,
    MatIconButton,
    MatIcon,
    MatError,
  ],
  templateUrl: './edit-password.html',
  styleUrl: './edit-password.scss',
})
export class EditPassword {
  readonly #profileService = inject(ProfileService);
  readonly #dialogRef = inject(MatDialogRef<NewTaskDialog>);
  readonly #destroyRef = inject(DestroyRef);
  readonly #snackBar = inject(MatSnackBar);

  readonly passwordModel = signal({
    password: '',
    repeatPassword: '',
  });

  readonly showPass = signal(false);
  readonly showPass2 = signal(false);

  readonly passwordForm = form(this.passwordModel, (schema) => {
    required(schema.password, { message: 'Debes introducir una contraseña' });
    required(schema.repeatPassword, { message: 'Debes repetir la contraseña' });
    validate(schema.repeatPassword, ({ value, valueOf }) => {
      const pass = valueOf(schema.password);
      if (value() !== pass) {
        return {
          kind: 'equal',
          message: 'Las contraseñas no coinciden',
        };
      }
      return null;
    });
  });

  savePassword() {
    this.#profileService
      .updatePassword(this.passwordModel().password)
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        finalize(() => this.#dialogRef.close(true)),
      )
      .subscribe({
        next: () => {
          this.#snackBar.open('Contraseña actualizada', 'Cerrar', {
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
