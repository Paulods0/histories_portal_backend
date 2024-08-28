import { AppError } from "./app-error"

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401)
  }
}
