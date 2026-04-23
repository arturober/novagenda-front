import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { SingleTaskResponse, TaskInsert, TaskListResponse } from '../interfaces/task';
import { CollaboratorsResponse } from '../interfaces/collaborator';
import { SubtasksResponse } from '../interfaces/subtask';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  readonly #http = inject(HttpClient);

  getTasksResource() {
    return httpResource<TaskListResponse>(() => 'tasks');
  }

  getTaskResource(id: Signal<string>) {
    return httpResource<SingleTaskResponse>(() => `tasks/${id()}`);
  }

  getCollaboratorsResource(id: Signal<string>) {
    return httpResource<CollaboratorsResponse>(() => `tasks/${id()}/collaborators`);
  }

  getSubtasksResource(id: Signal<string>) {
    return httpResource<SubtasksResponse>(() => `tasks/${id()}/subtasks`);
  }

  insertTask(task: TaskInsert) {
    return this.#http.post('tasks', task);
  }
}
