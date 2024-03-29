import { NextFunction, Request, Response } from "express"
import * as jwt from "jsonwebtoken"

export function checkValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Access Denied!" })
  }
  try {
    const secret = process.env.SECRET as string
    jwt.verify(token, secret)
    next()
  } catch (error) {
    res.status(400).json({ message: "Invalid token!" })
  }
}
