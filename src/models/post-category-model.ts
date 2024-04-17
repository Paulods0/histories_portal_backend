import mongoose, { Schema } from "mongoose"

const PostCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    slug: { type: String },
  },
  { timestamps: true }
)

export const PostCategory = mongoose.model("PostCategory", PostCategorySchema)
