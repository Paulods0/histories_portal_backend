import mongoose, { Document, Schema, Types } from "mongoose"
import { PostModel } from "./post-model"

export const userSchema = new Schema(
  {
    image: { type: String },
    role: { type: String, required: true },
    email: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    posts: [{ type: Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
)
//@ts-ignore
userSchema.pre("remove", async function (next) {
  try {
    //@ts-ignore
    await PostModel.deleteMany({ author: this._id })
    next()
  } catch (error) {
    next(error)
  }
})

export const UserModel = mongoose.model("User", userSchema)
