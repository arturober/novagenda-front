import { Component, DestroyRef, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Invitation } from '../../../tasks/interfaces/invitation';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { TaskInvitationService } from '../../services/task-invitation-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'manage-invitation-dialog',
  imports: [MatDialogContent, MatDialogActions, MatButton, MatDialogTitle],
  templateUrl: './manage-invitation-dialog.html',
  styleUrl: './manage-invitation-dialog.scss',
})
export class ManageInvitationDialog {
  readonly #taskInvitationService = inject(TaskInvitationService);
  readonly invitation = inject<Invitation>(MAT_DIALOG_DATA);
  readonly #dialogRef = inject(MatDialogRef<ManageInvitationDialog>);
  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);
  readonly #snackBar = inject(MatSnackBar);

  acceptInvitation() {
    this.#taskInvitationService
      .acceptInvitation(this.invitation.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.#dialogRef.close(true);
          this.#router.navigate(['/tasks', this.invitation.task.id]);
        },
        error: (err) =>
          this.#snackBar.open(err.error.message ?? err.error.cause, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          }),
      });
  }

  rejectInvitation() {
    if (this.invitation.email) {
      this.#taskInvitationService
        .acceptInvitation(this.invitation.id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: () => this.#dialogRef.close(false),
          error: (err) =>
            this.#snackBar.open(err.error.message ?? err.error.cause, 'Cerrar', {
              duration: 3000,
              panelClass: 'error',
            }),
        });
    } else {
      this.#dialogRef.close(false);
    }
  }
}
