import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { disabled, email, form, FormField, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { TaskInvitationService } from '../../../invitations/services/task-invitation-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Invitation } from '../../interfaces/invitation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'new-colab-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatRadioGroup,
    MatRadioButton,
    FormField,
  ],
  templateUrl: './new-colab-dialog.html',
  styleUrl: './new-colab-dialog.scss',
})
export class NewColabDialog {
  readonly taskId = inject<string>(MAT_DIALOG_DATA);
  readonly #taskInvitationService = inject(TaskInvitationService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #snackBar = inject(MatSnackBar);
  readonly location = window?.location;

  userType = signal<'email' | 'all'>('email');
  email = signal('');
  invitation = signal<Invitation | null>(null);
  isUserRegistered = signal(false);
  url = computed(() => location.origin + '/invitations/' + this.invitation()?.id);

  userTypeField = form(this.userType);
  emailField = form(this.email, (field) => {
    required(field);
    email(field);
    disabled(field, () => this.userType() === 'all');
  });

  createInvitation() {
    this.#taskInvitationService
      .createInvitation(this.taskId, this.userType() === 'email' ? this.email() : undefined)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (resp) => {
          this.invitation.set(resp.invitation);
          this.isUserRegistered.set(resp.isRegistered ?? false);
        },
        error: (err) => {
          this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          });
        },
      });
  }

  async copyUrl() {
    await Clipboard.write({ url: this.url() });
    this.#snackBar.open('Enlace copiado correctamente', 'Cerrar', {
      duration: 3000,
      panelClass: 'success',
    });
  }
}

// http://localhost:4200/invitations/a2c7ffc0-2c6e-40e8-b960-796a77e223d1
