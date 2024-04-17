import mongoose, { Schema, Types } from "mongoose"

const Post = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    highlighted: { type: Boolean, required: true, default: false },
    mainImage: { type: String, required: true, default: false },
    content: { type: String, required: true, default: false },
    title: { type: String, required: true },
    rating: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    author_notes: { type: String },
    longitude: { type: String },
    latitude: { type: String },
    tag: [{ type: String }],
  },
  { timestamps: true }
)

export const PostModel = mongoose.model("Post", Post)
