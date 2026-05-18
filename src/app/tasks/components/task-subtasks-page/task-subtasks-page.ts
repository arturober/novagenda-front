import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  MatList,
  MatListItem,
  MatListItemAvatar,
  MatListItemIcon,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle,
  MatListOption,
  MatSelectionList,
} from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewSubtaskDialog } from '../../dialogs/new-subtask-dialog/new-subtask-dialog';
import { Subtask } from '../../interfaces/subtask';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'task-subtasks-page',
  imports: [
    MatList,
    MatSelectionList,
    MatListItem,
    MatListOption,
    MatListItemMeta,
    MatListItemTitle,
    MatListItemLine,
    MatListItemIcon,
    MatIcon,
    MatIconButton,
    MatButton,
    MatCard,
    MatListItemAvatar,
  ],
  templateUrl: './task-subtasks-page.html',
  styleUrl: './task-subtasks-page.scss',
})
export class TaskSubtasksPage {
  id = input.required<string>();

  readonly #taskService = inject(TaskService);
  readonly #dialog = inject(MatDialog);
  readonly #destroyRef = inject(DestroyRef);
  readonly #snackBar = inject(MatSnackBar);
  readonly #changeDetector = inject(ChangeDetectorRef);

  subtasksResource = this.#taskService.getSubtasksResource(this.id);
  subtasks = linkedSignal(() =>
    this.subtasksResource.hasValue() ? this.subtasksResource.value().subtasks : [],
  );

  openNewSubtaskDialog() {
    const newTaskDialog = this.#dialog.open(NewSubtaskDialog, { data: this.id() });
    newTaskDialog.afterClosed().subscribe((created: Subtask | undefined) => {
      if (created) {
        this.subtasks.update((subtasks) => subtasks.concat(created));
      }
    });
  }

  updateCompleted(subtask: Subtask) {
    this.#taskService
      .completeSubTask(this.id(), subtask.id, subtask.completed)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        error: (err) => {
          this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          });
          subtask.completed = !subtask.completed;
          this.#changeDetector.markForCheck();
        },
      });
  }

  deleteSubtask(event: Event, subtask: Subtask) {
    event.stopPropagation();
        this.#taskService
      .deleteSubtask(this.id(), subtask.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.subtasks.update(subtasks => subtasks.filter(s => s !== subtask)),
        error: (err) => {
          this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          });
        },
      });
  }
}
