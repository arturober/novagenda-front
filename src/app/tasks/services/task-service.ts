import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { SingleTaskResponse, TaskInsert, TaskListResponse } from '../interfaces/task';
import { CollaboratorsResponse } from '../interfaces/collaborator';
import { SingleSubtaskResponse, SubtaskInsert, SubtasksResponse } from '../interfaces/subtask';

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
    return this.#http.post<SingleTaskResponse>('tasks', task);
  }

  insertSubtask(taskId: string, subtask: SubtaskInsert) {
    return this.#http.post<SingleSubtaskResponse>(`tasks/${taskId}/subtasks`, subtask);
  }

  completeSubTask(taskId: string, subtaskId: string, completed: boolean) {
    return this.#http.patch<SingleSubtaskResponse>(`tasks/${taskId}/subtasks/${subtaskId}/complete`, {
      completed,
    });
  }

  deleteSubtask(taskId: string, subtaskId: string) {
    return this.#http.delete<void>(`tasks/${taskId}/subtasks/${subtaskId}`);
  }
}
