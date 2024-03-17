import mongoose, { Schema } from "mongoose"

interface IProductSchema {
  image: string
  name: string
  price: string
  category: Schema.Types.ObjectId
}

const productSchema = new mongoose.Schema<IProductSchema>(
  {
    image: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const ProductModel = mongoose.model<IProductSchema>(
  "Product",
  productSchema
)
