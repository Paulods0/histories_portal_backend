import express from "express"
import * as dotenv from "dotenv"
import cors from "cors"
import postRoute from "./routes/post-route"
import tipsRoute from "./routes/tip-route"
import userRoute from "./routes/user-route"
import mailRoute from "./routes/mail-route"
import partnerRoute from "./routes/partner-route"
import productRoute from "./routes/product-route"
import scheduleRoute from "./routes/schedule-route"
import subscriberRoute from "./routes/subscriber-route"
import classifiedPostRoute from "./routes/classified-post-route"

import { connectDB } from "./config/db"

const PORT = process.env.PORT || 8181
const app = express()
dotenv.config({ path: __dirname + "./env" })

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

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT)
})
