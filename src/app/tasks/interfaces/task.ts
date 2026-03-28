import { User } from "../../auth/interfaces/user";

export interface TaskInsert {
  title: string;
  description?: string;
}

export interface Task extends TaskInsert {
  id: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  startDate?: string;
  endDate?: string;
  owner?: User;
}
