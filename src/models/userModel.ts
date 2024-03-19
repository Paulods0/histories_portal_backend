import mongoose, { Schema, Types } from "mongoose"

interface IUser {
  firstname: string
  lastname: string
  email: string
  password: string
  image?: string
  posts: Types.ObjectId[]
}

const userSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    password: { type: String, required: true },
    posts: [{ type: Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
)

export const UserModel = mongoose.model<IUser>("User", userSchema)
