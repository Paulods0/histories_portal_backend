import { createTransport } from "nodemailer"
import { PostModel } from "../models/post-model"
import { SubscriberModel } from "../models/subscriber-model"
import ejs from "ejs"

export function sendEmail(destination: string | string[], username: string) {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "overlandteste0@gmail.com",
      pass: "rozdziylkkhwomdi",
    },
  })

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
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "overlandteste0@gmail.com",
      pass: "rozdziylkkhwomdi",
    },
  })

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

function cleanHTML(html: string) {
  let temp = document.createElement("div")
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ""
}
