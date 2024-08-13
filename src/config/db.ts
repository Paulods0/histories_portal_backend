import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
})

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI as string
  try {
    const connection = await mongoose.connect(MONGO_URI)
    console.log(`DB connected ${connection.connection.host}`)
    console.log(`Enviroment:  ${process.env.NODE_ENV}`)
  } catch (error) {
    console.log("connection failed")
  }
}
