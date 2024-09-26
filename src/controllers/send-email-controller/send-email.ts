import { SendEmailRequestDTO } from "./send-email.types"
import { NextFunction, Request, Response } from "express"
import { SendEmailModel } from "../../models/send-email-model"

export class SendEmailController {
  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const emailState = await SendEmailModel.findOne()

      return res.status(200).json(emailState)
    } catch (error) {
      next(error)
    }
  }

  static async updateSendEmail(
    req: Request<{}, {}, SendEmailRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, value } = req.body

      const emailStatus = await SendEmailModel.findByIdAndUpdate(
        id,
        { $set: { canSendEmail: value } },
        { new: true }
      )

      return res.status(200).json({
        message: emailStatus?.canSendEmail
          ? "Envio de email ativado."
          : "Envio de email desativado.",
      })
    } catch (error) {
      next(error)
    }
  }
}
