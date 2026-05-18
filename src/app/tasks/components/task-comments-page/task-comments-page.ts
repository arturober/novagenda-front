import { Component, DestroyRef, inject, input, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, required } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatBubble } from '../../../shared/components/chat-bubble/chat-bubble';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'task-comments-page',
  imports: [MatCard, MatIcon, MatFormField, MatInput, FormField, MatIconButton, ChatBubble],
  templateUrl: './task-comments-page.html',
  styleUrl: './task-comments-page.scss',
})
export class TaskCommentsPage {
  id = input.required<string>();

  readonly #taskService = inject(TaskService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #snackBar = inject(MatSnackBar);

  commentsResource = this.#taskService.getCommentsResource(this.id);

  comments = linkedSignal(() =>
    this.commentsResource.hasValue() ? this.commentsResource.value().comments : [],
  );

  newCommentModel = signal({
    content: '',
  });

  newCommentForm = form(
    this.newCommentModel,
    (schema) => {
      required(schema.content);
    },
    {
      submission: {
        action: async () => this.insertComment(),
      },
    },
  );

  insertComment() {
    this.#taskService
      .insertComment(this.id(), this.newCommentModel())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (resp) => this.comments.update((comments) => [resp.comment].concat(comments)),
        error: (err) =>
          this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          }),
      });
  }
}
