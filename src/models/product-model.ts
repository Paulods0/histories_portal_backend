import mongoose, { Schema } from "mongoose"

const productSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    slug: { type: String, required: true },
    price: {
      type: String,
      required: true,
    },
    description:{
      type:String
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export const ProductModel = mongoose.model("Product", productSchema)
