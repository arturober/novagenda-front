export interface Subtask {
  id: string;
  description: string;
  completed: boolean;
}

export interface SubtasksResponse {
  subtasks: Subtask[];
}

export interface SingleSubtaskResponse {
  subtask: Subtask;
}
