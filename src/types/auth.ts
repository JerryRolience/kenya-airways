import { Role } from "../../generated/prisma/enums";

export interface SignUpData {
  firstName: string;
  lastName: string;
  phone: string;
  image?: string;
}

export interface AuthData {
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: Role;
}

export interface AuthenticatedUserData {
  user: AuthenticatedUser;
  isAdmin: boolean;
}
