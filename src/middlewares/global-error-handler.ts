import { AppError } from "./error/app-error"
import { NextFunction, Request, Response } from "express"

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  console.error(`ERRO NÂO CONTROLADO: ${err}`)
  return res.status(500).json({ message: "Algo deu errado!" })
}

export default globalErrorHandler
