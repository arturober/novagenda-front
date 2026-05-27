import { Component, inject, input, linkedSignal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatList,
  MatListItem,
  MatListItemAvatar,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle,
} from '@angular/material/list';
import { CollaborationRole } from '../../interfaces/collaborator';
import { TaskService } from '../../services/task-service';
import { TaskDetailsPage } from '../task-details-page/task-details-page';
import { MatDialog } from '@angular/material/dialog';
import { NewColabDialog } from '../../dialogs/new-colab-dialog/new-colab-dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'task-colab-page',
  imports: [
    MatList,
    MatListItem,
    MatListItemAvatar,
    MatListItemMeta,
    MatListItemTitle,
    MatListItemLine,
    MatIcon,
    MatIconButton,
    MatButton,
    MatCard,
    RouterLink,
  ],
  templateUrl: './task-colab-page.html',
  styleUrl: './task-colab-page.scss',
})
export class TaskColabPage {
  id = input.required<string>();

  readonly #taskDetailsPage = inject(TaskDetailsPage);
  readonly #taskService = inject(TaskService);
  readonly #dialog = inject(MatDialog);

  collaboratorsResource = this.#taskService.getCollaboratorsResource(this.id);
  collaborators = linkedSignal(() =>
    this.collaboratorsResource.hasValue() ? this.collaboratorsResource.value().collaborators : [],
  );
  mine = this.#taskDetailsPage.mine;

  getRoleName(role: CollaborationRole) {
    switch (role) {
      case 'OWNER':
        return 'Creador';
      case 'EDITOR':
        return 'Editor';
      case 'VIEWER':
        return 'Lector';
    }
  }

  deleteColab(colabId: string) {
    console.log(colabId);
  }

  openNewCategoryDialog() {
    const newTaskDialog = this.#dialog.open(NewColabDialog, { data: this.id() });
    newTaskDialog.afterClosed().subscribe(() => {
      this.collaboratorsResource.reload();
    });
  }
}
