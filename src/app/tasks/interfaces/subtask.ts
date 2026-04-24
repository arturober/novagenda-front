export interface SubtaskInsert {
  description: string;
}

export interface Subtask extends SubtaskInsert {
  id: string;
  completed: boolean;
}

export interface SubtasksResponse {
  subtasks: Subtask[];
}

export interface SingleSubtaskResponse {
  subtask: Subtask;
}
