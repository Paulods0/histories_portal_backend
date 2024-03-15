import mongoose, { Schema } from "mongoose"

interface IProductSchema {
  name: string
  price: string
  category: Schema.Types.ObjectId
}

const productSchema = new mongoose.Schema<IProductSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
  },
  { timestamps: true }
)

export const ProductModel = mongoose.model<IProductSchema>(
  "Product",
  productSchema
)
