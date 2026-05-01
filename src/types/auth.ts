import { Role, Title } from "../../generated/prisma/enums"

export interface PassengerSignUpData {
  firstName: string
  lastName: string
  title: Title
  phone: string
  passportNumber: string
  nationality: string
  dateOfBirth: Date
}

export interface SignUpPassengerData extends PassengerSignUpData {
  email: string
}

export interface AuthData {
  email: string
}

export interface AuthenticatedUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
}

export interface AuthenticatedUserData {
  user: AuthenticatedUser
  isAdmin: boolean
}
