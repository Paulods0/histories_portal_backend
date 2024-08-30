// import { Role } from "../../types"
export type LoginRequestDTO = {
  email: string
  password: string
}

export type CreateUserRequestDTO = {
  role: "admin" | "store-manager" | "publicator"
  email: string
  image?: string
  lastname: string
  password: string
  firstname: string
}
export type UpdateUserRequestDTO = {
  role?: string
  image?: string
  email?: string
  lastname?: string
  firstname?: string
}

export type GetUsersQueryParams = { page: string; limit: string }
