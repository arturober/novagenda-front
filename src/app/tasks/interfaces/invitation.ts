import { User } from "../../auth/interfaces/user";
import { Task } from "./task";

export interface Invitation {
  id: string;
  task: Task;
  inviter: User;
  email: string | null;
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
  expiresAt: string;
  createdAt: string;
  acceptedAt: string | null;
}

export interface InvitationsResponse {
  invitations: Invitation[];
}

export interface SingleInvitationResponse {
  invitation: Invitation;
  isRegistered?: boolean;
}
