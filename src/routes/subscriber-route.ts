import { Request, Response, Router } from "express"
import {
  getAllSubscribers,
  registerSubscriber,
  unregisterSubscriber,
} from "../controllers/subscriber-controller"

import { EmailProps, mailSend } from "../helpers"

const router = Router()

router.get("/", getAllSubscribers)
router.post("/register", registerSubscriber)
router.delete("/unregister/:id", unregisterSubscriber)


router.post("/want-to-be-yours", async (req: Request, res: Response) => {
  try {
    const { email, phone, description, countryCode, name, country, type } =
      req.body

    const data: EmailProps = {
      data: {
        name,
        email,
        type,
        country,
        description,
        phone: `${countryCode} ${phone}`,
      },
      to: email,
      from: email,
      template: "want-to-be-yours-template.ejs",
      subject: "QUERO SER VOSSO",
    }
    await mailSend(data)
    return res.status(200).send()
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
})

export = router
