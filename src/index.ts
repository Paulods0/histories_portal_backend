import cors from "cors"
import express from "express"
import * as dotenv from "dotenv"
import tipsRoute from "./routes/tip-route"
import mailRoute from "./routes/mail-route"
import postRoute from "./routes/post-route"
import userRoute from "./routes/user-route"
import partnerRoute from "./routes/partner-route"
import productRoute from "./routes/product-route"
import scheduleRoute from "./routes/schedule-route"
import subscriberRoute from "./routes/subscriber-route"
import classifiedPostRoute from "./routes/classified-post-route"

import { connectDB } from "./config/db"
import globalErrorHandler from "./middlewares/global-error-handler"

const PORT = process.env.PORT || 8080
const app = express()

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
})

const corsOptions = {
  origin: "https://overlandangola.com",
  optionsSuccessStatus: 200,
}

connectDB()
app.use(express.json())
app.use(cors())

app.use("/api/v1/tip", tipsRoute)
app.use("/api/v1/auth", userRoute)
app.use("/api/v1/post", postRoute)
app.use("/api/v1/mail", mailRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/partner", partnerRoute)
app.use("/api/v1/newsletter", subscriberRoute)
app.use("/api/v1/schedule-post", scheduleRoute)
app.use("/api/v1/classified-post", classifiedPostRoute)

app.use(globalErrorHandler)

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT)
})
