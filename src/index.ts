import express from "express"
import * as dotenv from "dotenv"
import cors from "cors"
import postRoute from "./routes/post-route"
import authRoute from "./routes/auth-route"
import productRoute from "./routes/product-route"
import postCategoryRoute from "./routes/post-category-route"
import scheduleRoute from "./routes/schedule-route"
import subscriberRoute from "./routes/subscriber-route"
import classifiedPostRoute from "./routes/classified-post-route"
import productCategoryRoute from "./routes/product-categoryRoute"

import { connectDB } from "./config/db"

const PORT = process.env.PORT || 8181
const app = express()
connectDB()

dotenv.config({ path: __dirname + "./env" })
app.use(express.json())
app.use(cors())

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/post", postRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/newsletter", subscriberRoute)
app.use("/api/v1/schedule-post", scheduleRoute)
app.use("/api/v1/post-category", postCategoryRoute)
app.use("/api/v1/classified-post", classifiedPostRoute)
app.use("/api/v1/product-category", productCategoryRoute)

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT)
})
