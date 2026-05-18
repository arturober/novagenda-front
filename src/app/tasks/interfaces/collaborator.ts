import { User } from "../../auth/interfaces/user";

export type CollaborationRole = 'OWNER' | 'EDITOR' | 'VIEWER'

export interface Collaborator {
  id: string;
  role: CollaborationRole;
  joinedAt: string;
  user: User;
}

export interface CollaboratorsResponse {
  collaborators: Collaborator[];
}

export interface SingleCollaboratorResponse {
  collaborator: Collaborator;
}
