import { Request, Response, Router } from "express"

import { EmailProps, mailSend } from "../helpers"

const router = Router()

router.post("/write-for-us", async (req: Request, res: Response) => {
  const { name, country, images, phone, email, context, history } = req.body
  const data: EmailProps = {
    data: {
      name,
      country,
      images,
      phone,
      email,
      context,
      history,
    },
    from: email,
    subject: "Escreve para nós",
    template: "write-for-us.ejs",
    to: "pauloluguenda0@gmail.com",
  }
  mailSend(data)
  return res.status(200).send()
})

export = router
