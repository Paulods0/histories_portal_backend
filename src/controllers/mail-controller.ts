import { Request, Response } from "express"
import { EmailProps, mailSend } from "../helpers"

type BodyProps = {
  user: {
    name: string
    email: string
    phone: string | number
  }
  products: {
    name: string
    imaage: string
    totalPrice: string
    storeQuantity: number
  }[]
}

export class MailController {
  public static async sendWriteForUsMail(req: Request, res: Response) {
    const { name, country, images, phone, email, contextualize, write } =
      req.body
    const data: EmailProps = {
      data: {
        name,
        country,
        images,
        phone,
        email,
        contextualize,
        write,
      },
      from: email,
      subject: "ESCREVE PARA NÓS",
      template: "write-for-us.ejs",
      to: "pauloluguenda0@gmail.com",
    }
    mailSend(data)
    return res.status(200).send()
  }

  public static async sendWantToBeYoursMail(req: Request, res: Response) {
    try {
      const { name, email, country, description, phone } = req.body
      const emailBody: EmailProps = {
        data: {
          name: name,
          email: email,
          phone: phone,
          country: country,
          description: description,
        },
        from: email,
        to: "pauloluguenda0@gmail.com",
        subject: "QUERO SER VOSSO",
        template: "want-to-be-yours-template.ejs",
      }
      await mailSend(emailBody)
      return res.status(200).json({ message: "Email enviado com sucesso" })
    } catch (error) {
      return res.status(400).json({ message: "Erro ao enviar", error })
    }
  }

  public static async buyProduct(
    req: Request<{}, {}, BodyProps>,
    res: Response
  ) {
    try {
      const { user, products } = req.body

      const formatedProducts = products.map((product) => {
        return {
          ...product,
          totalPrice: new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "AKZ",
          }).format(Number(product.totalPrice)),
        }
      })

      const data: EmailProps = {
        data: {
          user,
          products: formatedProducts,
        },
        from: user.email,
        to: "pauloluguenda0@gmail.com",
        subject: "COMPRA DE ARTIGO(S)",
        template: "buy-product-email-template.ejs",
      }

      await mailSend(data)

      return res.status(200).end()
    } catch (error) {
      return res.status(400).json({ error })
    }
  }
}