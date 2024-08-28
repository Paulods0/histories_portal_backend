import { AppError } from "./app-error"

export class CommonError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode)
  }
}
