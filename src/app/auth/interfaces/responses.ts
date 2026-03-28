import { User } from "./user";

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  idRefresh: string;
}

export interface SingleUserResponse {
  user: User;
}
