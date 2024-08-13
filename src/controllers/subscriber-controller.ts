import { Request, Response } from "express"
import { EmailProps, mailSend } from "../helpers"
import { SubscriberModel } from "../models/subscriber-model"
import { Types } from "mongoose"

export class SubscriberController {
  public static async registerSubscriber(req: Request, res: Response) {
    try {
      const { email, name, phone, country, countryCode } = req.body
      if (!email || !name) {
        return res
          .status(400)
          .json({ message: "Preencha todos os campos obrigatórios" })
          .end()
      }
      const existingSubscriber = await SubscriberModel.findOne({ email })
      if (existingSubscriber) {
        return res
          .status(400)
          .json({ message: "Este email já existe, por favor tente outro" })
          .end()
      }

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
          email: subscriber.email,
          name: subscriber.name,
          id: subscriber._id,
        },
        from: "webmaster.overlandangola@aol.com",
        subject: "BEM-VINDO AO OVERLAND ANGOLA",
        template: "subscriber-welcome-template.ejs",
        to: subscriber.email!!,
      }

      await mailSend(data)

      return res.status(200).json(subscriber)
    } catch (error) {
      return res.status(400).json({ error })
    }
  }

  public static async unregisterSubscriber(req: Request, res: Response) {
    try {
      const { email } = req.body
      const user = await SubscriberModel.findOne({ email: email })
      if (!user) {
        return res.status(404).json({ message: "Não existe" })
      }
      await user.deleteOne()
      return res.status(200).json({ messsage: "Removido com sucesso" })
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  }

  public static async getAllSubscribers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = 3
    const skip = limit * (page - 1)
    const totalDocs = await SubscriberModel.countDocuments()
    const totalPages = Math.ceil(totalDocs / limit)

    try {
      const subscribers = await SubscriberModel.find()
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })

      return res.status(200).json({ pages: totalPages, subs: subscribers })
    } catch (error) {
      console.error(error)
      return res.status(400).end()
    }
  }

  public static async updateSub(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, email, country } = req.body

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Id inválido" })
      }

      const updatedSub = await SubscriberModel.findOneAndUpdate(
        { _id: id },
        { name, email, country },
        { new: true }
      )

      return res
        .status(200)
        .json({ message: "Atualizado com sucesso", sub: updatedSub })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ error, message: "Erro no servidor" }).end()
    }
  }

  public static async deleteSub(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Id inválido" })
      }

      await SubscriberModel.findOneAndDelete({ _id: id })
      
      return res.status(200).json({ message: "Removido com sucesso" })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ error, message: "Erro no servidor" }).end()
    }
  }
}
