import { User } from "../../auth/interfaces/user";
import { Category } from "../../categories/interfaces/category";

export interface TaskInsert {
  title: string;
  description?: string | null;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  rrule?: string | null;
  category?: string | null;
}

export interface Task extends Required<Omit<TaskInsert, 'category'>> {
  id: string;
  owner: User;
  isActive: boolean;
  category: Category | null;
}

export interface TaskListResponse {
  tasks: Task[];
}

export interface SingleTaskResponse {
  task: Task;
}
