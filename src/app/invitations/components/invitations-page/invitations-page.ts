import { Component, computed, effect, inject, input } from '@angular/core';
import { TaskInvitationService } from '../../services/task-invitation-service';
import { MatDialog } from '@angular/material/dialog';
import { ManageInvitationDialog } from '../../dialogs/manage-invitation-dialog/manage-invitation-dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { TopBar } from '../../../shared/components/top-bar/top-bar';
import { MatCard } from '@angular/material/card';
import { MatActionList, MatDivider, MatListItem, MatListItemTitle } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { Invitation } from '../../../tasks/interfaces/invitation';

@Component({
  selector: 'invitations-page',
  imports: [TopBar, MatCard, MatActionList, MatListItem, MatIcon, MatDivider, MatListItemTitle],
  templateUrl: './invitations-page.html',
  styleUrl: './invitations-page.scss',
})
export class InvitationsPage {
  id = input<string>();

  readonly #taskInvitationService = inject(TaskInvitationService);
  readonly #dialog = inject(MatDialog);
  readonly #snackBar = inject(MatSnackBar);
  readonly #router = inject(Router);

  invitationsResource = this.#taskInvitationService.getInvitationsResource();
  invitationResource = this.#taskInvitationService.getInvitationResource(this.id);

  invitations = computed(() =>
    this.invitationsResource.hasValue() ? this.invitationsResource.value().invitations : [],
  );

  constructor() {
    effect(() => {
      if (this.invitationResource.hasValue()) {
        this.openInvitationDialog(this.invitationResource.value().invitation);
      } else if (this.invitationResource.error()) {
        const err = this.invitationResource.error()! as HttpErrorResponse;
        this.#snackBar.open(err.error.message ?? err.error.cause, 'Cerrar', {
          duration: 3000,
          panelClass: 'error',
        });
        this.#router.navigate(['/invitations']);
      }
    });
  }

  openInvitationDialog(invitation: Invitation) {
    const newTaskDialog = this.#dialog.open(ManageInvitationDialog, {
      data: invitation,
    });
    newTaskDialog.afterClosed().subscribe(() => {
      this.#router.navigate(['/invitations']);
      this.invitationResource.reload();
    });
  }
}
