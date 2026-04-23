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
  MatListItemTitle
} from '@angular/material/list';
import { CollaborationRole } from '../../interfaces/collaborator';
import { TaskService } from '../../services/task-service';

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
  ],
  templateUrl: './task-colab-page.html',
  styleUrl: './task-colab-page.scss',
})
export class TaskColabPage {
  id = input.required<string>();

  readonly #taskService = inject(TaskService);

  collaboratorsResource = this.#taskService.getCollaboratorsResource(this.id);
  collaborators = linkedSignal(() =>
    this.collaboratorsResource.hasValue() ? this.collaboratorsResource.value().collaborators : [],
  );

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
    //...
  }
}
