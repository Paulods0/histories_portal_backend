import mongoose, { Schema, Types } from "mongoose"

interface IPost {
  title: string
  mainImage: string
  content: string
  author: Schema.Types.ObjectId
  isHighlighted: boolean
  category: Schema.Types.ObjectId
  author_notes?: string
}

export interface IPostDB extends IPost, Document {}

const Post = new Schema(
  {
    title: { type: String, required: true },
    mainImage: { type: String, required: true },
    content: { type: String, required: true },
    isHighlighted: { type: Boolean, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    author_notes: { type: String },
  },
  { timestamps: true }
)

export const PostModel = mongoose.model<IPostDB>("Post", Post)
