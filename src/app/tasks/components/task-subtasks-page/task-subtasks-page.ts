import { Component, inject, input, linkedSignal } from '@angular/core';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatList,
  MatListItem,
  MatListItemAvatar,
  MatListItemMeta,
  MatListItemTitle,
  MatListItemLine,
  MatSelectionList,
} from '@angular/material/list';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'task-subtasks-page',
  imports: [
    MatList,
    MatSelectionList,
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
  templateUrl: './task-subtasks-page.html',
  styleUrl: './task-subtasks-page.scss',
})
export class TaskSubtasksPage {
    id = input.required<string>();

  readonly #taskService = inject(TaskService);

  subtasksResource = this.#taskService.getSubtasksResource(this.id);
  subtasks = linkedSignal(() =>
    this.subtasksResource.hasValue() ? this.subtasksResource.value().subtasks : [],
  );

  openNewSubtaskDialog() {
    //...
  }
}
