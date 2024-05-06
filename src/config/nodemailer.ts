import { createTransport } from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

export const sendMail = async (
  from: string,
  to: string,
  subject: string,
  html: string
) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "overlandteste0@gmail.com",
      pass: "rozdziylkkhwomdi",
    },
  })

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error)
    } else {
      console.info(`Email sent:  ${info.response}`)
    }
  })
}
