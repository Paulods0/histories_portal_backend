import { createTransport } from "nodemailer"
import { PostModel } from "../models/post-model"
import { SubscriberModel } from "../models/subscriber-model"
import ejs from "ejs"

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "overlandteste0@gmail.com",
    pass: "rozdziylkkhwomdi",
  },
})

export function sendEmail(destination: string | string[], username: string) {
  ejs.renderFile(
    `./src/views/welcome.ejs`,
    { userName: username },
    function (error, htmlTemplate) {
      if (error) {
        console.log(error)
      } else {
        const mailOptions = {
          from: "overlandteste0@gmail.com",
          to: destination,
          subject: "Overland Angola",
          html: htmlTemplate,
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error)
          }
          console.log("Email enviado: " + info)
        })
      }
    }
  )
}
type Post = {
  mainImage: string
  title: string
  content: string
}

export async function sendNewsletterPosts(
  users: string[] | string,
  posts: Post[]
) {
  ejs.renderFile(
    `./src/views/post.ejs`,
    { posts },
    function (error, htmlTemplate) {
      if (error) {
        console.log(error)
      } else {
        const mailOptions = {
          from: "overlandteste0@gmail.com",
          to: users,
          subject: "Overland Angola",
          html: htmlTemplate,
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error)
          }
          console.log("Email enviado: " + info)
        })
      }
    }
  )
}

type User = {
  firstname: string
  lastname: string
  email: string
  password: string
  role: string
  roleInfo: string
}

export async function welcomeUserMail(user: User) {
  try {
    ejs.renderFile(
      "./src/views/register-welcome.ejs",
      { user },
      function (error, template) {
        if (error) {
          throw new Error(String(error))
        } else {
          const mailOptions = {
            subject: "Novo Administrador Do Site Overland Angola",
            from: "overlandteste0@gmail.com",
            to: user.email,
            html: template,
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error)
              throw new Error(String(error))
            } else {
              console.log("Email enviado: " + info)
            }
          })
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}

export type BuyProductData = {
  user: {
    firstname: string
    lastname: string
    email: string
    phone: string
  }
  product: {
    name: string
    price: string
    quantity: number
    totalPrice: number
  }[]
}

export async function buyProduct(data: BuyProductData) {
  try {
    ejs.renderFile(
      "./src/views/store-mail.ejs",
      { data },
      function (error, template) {
        if (error) {
          throw new Error(String(error))
        } else {
          const mailOptions = {
            subject: "COMPRAR PRODUTO",
            from: "overlandteste0@gmail.com",
            to: data.user.email,
            html: template,
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error)
              throw new Error(String(error))
            } else {
              console.log("Email enviado: " + info)
            }
          })
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}
