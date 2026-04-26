import { Component, computed, input } from '@angular/core';
import { TaskComment } from '../../../tasks/interfaces/comment';
import { DateIntlPipe } from '../../pipes/date-intl-pipe';

@Component({
  selector: 'chat-bubble',
  imports: [DateIntlPipe],
  templateUrl: './chat-bubble.html',
  styleUrl: './chat-bubble.scss',
})
export class ChatBubble {
  comment = input.required<TaskComment>();

  // Lógica de clases reactiva
  containerClasses = computed(() => {
    const mine = this.comment().mine;
    return mine
      ? 'rounded-br-none ml-auto mr-1 bg-(--mat-sys-primary-container) text-(--mat-sys-on-primary-container)'
      : 'rounded-bl-none ml-1 mr-auto bg-(--mat-sys-surface-container-low) text-(--mat-sys-on-surface)';
  });

  tailClasses = computed(() => {
    const mine = this.comment().mine;
    return `tail-base ${mine ? 'tail-right border-l-(--mat-sys-primary-container)!' : 'tail-left border-r-(--mat-sys-surface-container-low)!'}`;
  });

  commentDate = computed(() => {
    const date = new Date(this.comment().createdAt);
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  });
}
