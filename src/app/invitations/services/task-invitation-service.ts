import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { InvitationsResponse, SingleInvitationResponse } from '../../tasks/interfaces/invitation';

@Injectable({
  providedIn: 'root',
})
export class TaskInvitationService {
  readonly #http = inject(HttpClient);

  getInvitationsResource() {
    return httpResource<InvitationsResponse>(() => 'invitations');
  }

  getInvitationResource(id: Signal<string | undefined>) {
    return httpResource<SingleInvitationResponse>(() => id() ? `invitations/${id()}` : undefined);
  }

  createInvitation(taskId: string, email?: string) {
    return this.#http.post<SingleInvitationResponse>(
      `tasks/${taskId}/collaborators`,
      email ? { email } : {},
    );
  }

  acceptInvitation(idInvitation: string) {
    return this.#http.post<void>(`invitations/${idInvitation}/accept`, null);
  }

  rejectInvitation(idInvitation: string) {
    return this.#http.delete<void>(`invitations/${idInvitation}/reject`);
  }
}
