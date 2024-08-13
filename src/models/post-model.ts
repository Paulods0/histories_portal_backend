import mongoose, { Schema } from "mongoose"

const Post = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  highlighted: { type: Boolean, required: true, default: false },
  mainImage: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  rating: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  category_slug: { type: String },
  author_notes: { type: String },
  longitude: { type: String },
  latitude: { type: String },
  tag: [{ type: String }],
})

export const PostModel = mongoose.model("Post", Post)
