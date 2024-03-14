import mongoose, { Schema } from "mongoose"
import { Types } from "mongoose"

interface ICategoryModel {
  name: string
}

interface ICategoryModelDB extends ICategoryModel, Document {}
const categorySchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
)

export const CategoryModel = mongoose.model<ICategoryModelDB>(
  "Category",
  categorySchema
)
