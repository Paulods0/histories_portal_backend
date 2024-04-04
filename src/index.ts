import express from "express"
import * as dotenv from "dotenv"
import cors from "cors"
import postRoute from "../src/routes/postRoute"
import categoryRoute from "../src/routes/categoryRoute"
import authRoute from "../src/routes/authRoute"
import productRoute from "../src/routes/productRoute"
import productCategoryRoute from "../src/routes/productCategoryRoute"
import subscriberRoute from "../src/routes/subscriberRoute"

import { connectDB } from "./config/db"

const app = express()
connectDB()
const PORT = process.env.PORT || 8181

dotenv.config({ path: __dirname + "./env" })
app.use(express.json())
app.use(cors())

app.use("/api/post", postRoute)
app.use("/api/category", categoryRoute)
app.use("/api/auth", authRoute)
app.use("/api/product", productRoute)
app.use("/api/prod-category", productCategoryRoute)
app.use("/api/newsletter", subscriberRoute)

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT)
})
