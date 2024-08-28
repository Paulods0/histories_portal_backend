import mongoose, { Schema } from "mongoose"

const TipsSchema = new mongoose.Schema(
  {
    author_notes: { type: String },
    title: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: "tip" },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

export const TipsModel = mongoose.model("Tips", TipsSchema)
