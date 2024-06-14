export interface IUsers {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export interface IJwtPayload {
  userId: number;
  name: string;
  email: string;
}

export type TUserInfoContext = {
  userId: number;
  name: string;
  email: string;
} | null;
