import { Request, Response } from "express"
import { SubscriberModel } from "../models/subscriber-model"
import { PostModel } from "../models/post-model"
import { createTransport } from "nodemailer"
import ejs from "ejs"
import { sendEmail, sendNewsletterPosts } from "../helpers"

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
  sendEmail(subscriber.email!!, subscriber.name!!)
  return res.status(200).json(subscriber)
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
const sendMailToSubs = async (req: Request, res: Response) => {
  const posts = await PostModel.find().limit(3)
  const subscribers = await SubscriberModel.find()

  let emails: string[] = [""]
  subscribers.forEach((sub) => {
    emails.push(sub.email!!)
  })

  await sendNewsletterPosts(emails, posts)
  return res.status(200).json({ message: "Email enviado" })
  try {
  } catch (error) {
    console.error(error)
    return res.status(400).json(error)
  }
}

export {
  registerSubscriber,
  unregisterSubscriber,
  getAllSubscribers,
  sendMailToSubs,
}
