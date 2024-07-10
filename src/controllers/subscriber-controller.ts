import { Request, Response } from "express"
import { EmailProps, mailSend } from "../helpers"
import { SubscriberModel } from "../models/subscriber-model"

export class Subscriber {
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
        from: "overlandteste0@gmail.com",
        subject: "Bem-vindo ao Overland Angola",
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
        return res.status(404).json({ message: "Usuário não existe" })
      }
      await user.deleteOne()
      return res.status(200).json({ messsage: "Deletado" })
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  }

  public static async getAllSubscribers(req: Request, res: Response) {
    try {
      const subscribers = await SubscriberModel.find().sort({ createdAt: -1 })
      return res.status(200).json(subscribers)
    } catch (error) {
      console.error(error)
      return res.status(400).end()
    }
  }
}
