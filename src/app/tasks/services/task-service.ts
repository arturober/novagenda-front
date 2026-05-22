import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { CollaboratorsResponse } from '../interfaces/collaborator';
import {
  SingleTaskCommentResponse,
  TaskCommentInsert,
  TaskCommentsResponse,
} from '../interfaces/comment';
import { SingleSubtaskResponse, SubtaskInsert, SubtasksResponse } from '../interfaces/subtask';
import { SingleTaskResponse, TaskInsert, TaskListResponse } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  readonly #http = inject(HttpClient);

  getTasksResource() {
    return httpResource<TaskListResponse>(() => 'tasks');
  }

  getTasksByDateResource(startDate: Signal<string>, endDate: Signal<string>) {
    return httpResource<TaskListResponse>(() => {
      const params = new URLSearchParams({
        start: startDate(),
        end: endDate()
      });
      return `tasks?${params}`
    });
  }

  getTaskResource(id: Signal<string>) {
    return httpResource<SingleTaskResponse>(() => `tasks/${id()}`);
  }

  getOverdueTasksResource(load: Signal<boolean>, page: Signal<number>) {
    return httpResource<TaskListResponse>(() => {
      const params = new URLSearchParams({
        page: page().toString(),
      });
      return load() ? `tasks/overdue?${params.toString()}` : undefined;
    });
  }

  getCompletedTasksResource(load: Signal<boolean>, page: Signal<number>) {
    return httpResource<TaskListResponse>(() => {
      const params = new URLSearchParams({
        page: page().toString(),
      });
      return load() ? `tasks/inactive?${params.toString()}` : undefined;
    });
  }

  getCollaboratorsResource(id: Signal<string>) {
    return httpResource<CollaboratorsResponse>(() => `tasks/${id()}/collaborators`);
  }

  getSubtasksResource(id: Signal<string>) {
    return httpResource<SubtasksResponse>(() => `tasks/${id()}/subtasks`);
  }

  getCommentsResource(id: Signal<string>) {
    return httpResource<TaskCommentsResponse>(() => `tasks/${id()}/comments`);
  }

  insertTask(task: TaskInsert) {
    return this.#http.post<SingleTaskResponse>('tasks', task);
  }

  insertSubtask(taskId: string, subtask: SubtaskInsert) {
    return this.#http.post<SingleSubtaskResponse>(`tasks/${taskId}/subtasks`, subtask);
  }

  removeTask(id: string) {
    return this.#http.delete<void>(`tasks/${id}`);
  }

  completeTask(id: string, completed: boolean, occurrenceDate?: string) {
    return this.#http.patch<void>(`tasks/${id}/complete`, { completed, occurrenceDate });
  }

  cancelOccurrence(id: string, occurrenceDate: string) {
    return this.#http.patch<void>(`tasks/${id}/cancel`, { occurrenceDate });
  }

  completeSubTask(taskId: string, subtaskId: string, completed: boolean) {
    return this.#http.patch<SingleSubtaskResponse>(
      `tasks/${taskId}/subtasks/${subtaskId}/complete`,
      {
        completed,
      },
    );
  }

  deleteSubtask(taskId: string, subtaskId: string) {
    return this.#http.delete<void>(`tasks/${taskId}/subtasks/${subtaskId}`);
  }

  insertComment(taskId: string, comment: TaskCommentInsert) {
    return this.#http.post<SingleTaskCommentResponse>(`tasks/${taskId}/comments`, comment);
  }
}
