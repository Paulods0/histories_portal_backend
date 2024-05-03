import { Request, Response } from "express"
import { SubscriberModel } from "../models/subscriber-model"
import { PostModel } from "../models/post-model"
import { createTransport } from "nodemailer"

const registerSubscriber = async (req: Request, res: Response) => {
  const { email, name } = req.body
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
  const subscriber = new SubscriberModel({ email, name })
  await subscriber.save()
  return res.status(200).json(subscriber)
}

const unregisterSubscriber = async (req: Request, res: Response) => {
  const { id } = req.params

  await SubscriberModel.findByIdAndDelete(id)

  console.log("success")
  return res.status(200).json({ message: "Unregister" })
}

const sendEmail = async (req: Request, res: Response) => {
  const subscribers = await SubscriberModel.find()
  const posts = await PostModel.find().limit(3).sort({ createdAt: -1 })

  try {
    const htmlContent = ""

    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: "overlandteste0@gmail.com",
        pass: "rozdziylkkhwomdi",
      },
    })

    const replacements = htmlContent.replace(
      "%cancelarsubscrição%",
      `http://localhost:5173/unsubscribe/${""}`
    )

    const mailOptions = {
      from: "overlandteste0@gmail.com",
      to: "",
      subject: "Overland Angola",
      html: replacements,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error)
        return res.status(400).json({ error })
      }
      console.log("Email enviado: " + info)
      return res.status(200).json({ info })
    })
  } catch (error) {
    console.error(error)
    return res.status(400).end()
  }
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

export {
  registerSubscriber,
  unregisterSubscriber,
  sendEmail,
  getAllSubscribers,
}
