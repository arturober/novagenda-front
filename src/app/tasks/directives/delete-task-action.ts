import { Directive, inject, input, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { ConfirmDialog } from '../../shared/dialogs/confirm-dialog/confirm-dialog';
import { Task } from '../interfaces/task';
import { TaskService } from '../services/task-service';

@Directive({
  selector: '[deleteTaskAction]',
  exportAs: 'deleteTaskAction',
  host: {
    '(click)': 'delete()',
  },
})
export class DeleteTaskAction {
  task = input.required<Task>();
  occurrenceDate = input<string | undefined>();
  deleted = output<void>();

  readonly #taskService = inject(TaskService);
  readonly #dialog = inject(MatDialog);

  delete() {
      let dialogResponse$: Observable<1 | 2 | null>;
      if (this.task().rrule && this.occurrenceDate()) {
        dialogResponse$ = this.#dialog
          .open(ConfirmDialog, {
            data: {
              title: 'Borrar tarea',
              text: '¿Quieres borrar solo esta fecha o eliminar completamente la tarea?',
              buttons: [
                {
                  text: 'Borrar fecha',
                  value: 1,
                },
                {
                  text: 'Eliminar tarea',
                  value: 2,
                },
                {
                  text: 'Cancelar',
                  value: null,
                },
              ],
            },
          })
          .afterClosed();
      } else {
        dialogResponse$ = this.#dialog
          .open(ConfirmDialog, {
            data: {
              title: 'Borrar tarea',
              text: '¿Está seguro de que desea eliminar la tarea?',
              buttons: [
                {
                  text: 'Eliminar tarea',
                  value: 2,
                },
                {
                  text: 'Cancelar',
                  value: null,
                },
              ],
            },
          })
          .afterClosed();
      }
  
      dialogResponse$
        .pipe(
          switchMap((action) => {
            if (action === 1) {
              return this.#taskService.cancelOccurrence(this.task().id, this.occurrenceDate()!);
            } else if (action === 2) {
              return this.#taskService.removeTask(this.task().id);
            }
            return EMPTY;
          }),
        )
        .subscribe(() => this.deleted.emit());
    }
}
