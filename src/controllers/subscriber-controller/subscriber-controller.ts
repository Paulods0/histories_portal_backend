import {
  SubsQueryParams,
  CreateSubRequestDTO,
  UpdateSubRequestDTO,
} from "./subscriber-controller.types"
import { Types } from "mongoose"
import { EmailProps, mailSend } from "../../helpers"
import { NextFunction, Request, Response } from "express"
import { SubscriberModel } from "../../models/subscriber-model"
import { CommonError } from "../../middlewares/error/common-error"
import { ValidationError } from "../../middlewares/error/validation"

export class SubscriberController {
  public static async registerSubscriber(
    req: Request<{}, {}, CreateSubRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, name, phone, country, countryCode } = req.body

      if (!name) throw new ValidationError("O nome é obrigatório.")
      if (!email) throw new ValidationError("O email é obrigatório.")

      const existingSubscriber = await SubscriberModel.findOne({ email })

      if (existingSubscriber) throw new CommonError("O usuário já existe.", 409)

      const subscriber = new SubscriberModel({
        email,
        name,
        phone,
        country,
        countryCode,
      })

      await subscriber.save()

      const data: EmailProps = {
        data: {
          id: subscriber._id,
          name: subscriber.name,
          email: subscriber.email,
        },
        to: subscriber.email!!,
        subject: "BEM-VINDO AO OVERLAND ANGOLA",
        from: "webmaster.overlandangola@aol.com",
        template: "subscriber-welcome-template.ejs",
      }

      await mailSend(data)
      return res.status(200).json(subscriber)
    } catch (error) {
      next(error)
    }
  }

  public static async unregisterSubscriber(
    req: Request<{}, {}, { email: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body

      const user = await SubscriberModel.findOne({ email: email })
      if (!user) throw new ValidationError("Não encontrado.")

      await user.deleteOne()
      return res.status(200).json({ messsage: "Removido com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  public static async getAllSubscribers(
    req: Request<{}, {}, {}, SubsQueryParams>,
    res: Response,
    next: NextFunction
  ) {
    const { page: queryPage } = req.query
    const page = parseInt(queryPage) || 1
    const limit = 3
    const skip = limit * (page - 1)
    const totalDocs = await SubscriberModel.countDocuments()
    const totalPages = Math.ceil(totalDocs / limit)

    try {
      const subscribers = await SubscriberModel.find()
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })

      return res
        .status(200)
        .json({ pages: totalPages, subs: subscribers, total: totalDocs })
    } catch (error) {
      next(error)
    }
  }

  public static async updateSub(
    req: Request<{ id: string }, {}, UpdateSubRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      const { name, email, country, countryCode, phone } = req.body

      if (!Types.ObjectId.isValid(id)) throw new ValidationError("Id inválido.")

      await SubscriberModel.findOneAndUpdate(
        { _id: id },
        { name, email, country, countryCode, phone }
      )

      return res.status(200).json({ message: "Atualizado com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  public static async deleteSub(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) throw new ValidationError("Id inválido.")

      await SubscriberModel.findOneAndDelete({ _id: id })

      return res.status(200).json({ message: "Removido com sucesso." })
    } catch (error) {
      next(error)
    }
  }
}
