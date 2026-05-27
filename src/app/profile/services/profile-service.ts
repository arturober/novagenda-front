import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { SingleUserResponse } from '../../auth/interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  readonly #http = inject(HttpClient);

  getUserResource(id: Signal<string | undefined>) {
    return httpResource<SingleUserResponse>(() => id() ? `users/profile/${id()}` : undefined);
  }

  updateAvatar(avatar: string) {
    return this.#http.patch<void>('users/profile/avatar', { avatar });
  }

  updateName(name: string) {
    return this.#http.patch<void>('users/profile/name', { name });
  }

  updatePassword(password: string) {
    return this.#http.patch<void>('users/profile/password', { password });
  }
}
