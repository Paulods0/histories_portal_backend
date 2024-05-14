import mongoose, { Schema, Types } from "mongoose"


const userSchema = new Schema(
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

export const UserModel = mongoose.model("User", userSchema)
