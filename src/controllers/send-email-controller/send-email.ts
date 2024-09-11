import { SendEmailRequestDTO } from "./send-email.types"
import { NextFunction, Request, Response } from "express"
import { SendEmailModel } from "../../models/send-email-model"

export class SendEmailController {
  static async updateSendEmail(
    req: Request<{}, {}, SendEmailRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, value } = req.body
      const updated = await SendEmailModel.findOneAndUpdate(
        { _id: id },
        { canSendEmail: value },
        { new: true }
      )
      return res
        .status(200)
        .json({ message: "Atualizado com sucesso", updated })
    } catch (error) {
      next(error)
    }
  }
}
