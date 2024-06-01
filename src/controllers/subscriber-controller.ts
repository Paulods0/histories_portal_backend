import { Request, Response } from "express"
import { EmailProps, mailSend } from "../helpers"
import { SubscriberModel } from "../models/subscriber-model"

const registerSubscriber = async (req: Request, res: Response) => {
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

const unregisterSubscriber = async (req: Request, res: Response) => {
  const { id } = req.params

  await SubscriberModel.findByIdAndDelete(id)

  console.log("success")
  return res.status(200).json({ message: "Unregister" })
}

const getAllSubscribers = async (req: Request, res: Response) => {
  try {
    const subscribers = await SubscriberModel.find().sort({ createdAt: -1 })
    return res.status(200).json(subscribers)
  } catch (error) {
    console.error(error)
    return res.status(400).end()
  }
}

export { registerSubscriber, unregisterSubscriber, getAllSubscribers }
