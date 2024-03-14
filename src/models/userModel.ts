import mongoose, { Schema } from "mongoose"

interface IUser {
  firstname: string
  lastname: string
  email: string
  password: string
  image?: string
}

const userSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

export const UserModel = mongoose.model<IUser>("User", userSchema)
