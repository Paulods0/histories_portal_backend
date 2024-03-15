import mongoose from "mongoose"

interface IProductCategory {
  name: string
}

const productCategorySchema = new mongoose.Schema<IProductCategory>(
  {
    name: { type: String },
  },
  { timestamps: true }
)

export const productCategoryModel = mongoose.model<IProductCategory>(
  "ProductCategory",
  productCategorySchema
)
