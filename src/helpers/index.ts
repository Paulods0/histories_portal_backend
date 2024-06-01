import { createTransport } from "nodemailer"
import ejs from "ejs"

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "overlandteste0@gmail.com",
    pass: "rozdziylkkhwomdi",
  },
})

export type EmailProps = {
  data: unknown
  template: string
  to: string | string[]
  from: string
  subject: string
}
export async function mailSend(emailProps: EmailProps) {
  try {
    ejs.renderFile(
      `./src/views/${emailProps.template}`,
      { data: emailProps.data },
      function (error, template) {
        if (error) {
          throw new Error(String(error))
        } else {
          const options = {
            subject: emailProps.subject,
            to: emailProps.to,
            from: emailProps.from,
            html: template,
          }
          transporter.sendMail(options, (error, info) => {
            if (error) {
              throw new Error(String(error))
            } else {
              console.log(info)
            }
          })
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}
