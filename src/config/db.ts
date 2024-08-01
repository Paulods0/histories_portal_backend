import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({ path: ".env" })

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI as string
  try {
    const connection = await mongoose.connect(MONGO_URI)
    console.log(`DB connected ${connection.connection.host}`)
  } catch (error) {
    console.log("connection failed")
  }
}
