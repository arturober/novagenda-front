import { User } from "../../auth/interfaces/user";

export interface TaskCommentInsert {
  content: string;
}

export interface TaskComment extends TaskCommentInsert {
  id: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  mine: boolean;
}

export interface TaskCommentsResponse {
  comments: TaskComment[];
}

export interface SingleTaskCommentResponse {
  comment: TaskComment;
}
