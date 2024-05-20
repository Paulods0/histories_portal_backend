import mongoose from "mongoose"

type Author = {
  firstname: string
  lastname: string
  email: string
  phone: string
}

const ClassifiedSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    mainImage: { type: String },
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    price: { type: String, required: true },
    category_slug: { type: String },
    type: { type: String, required: true },
    status: { type: String, required: true, default: "inactive" },
  },
  { timestamps: true }
)

export const ClassifiedPostModel = mongoose.model(
  "ClassifiedPost",
  ClassifiedSchema
)
