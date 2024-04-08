import mongoose, { Schema } from "mongoose"
import { Types } from "mongoose"

interface ICategoryModel {
  name: string
  creator: Schema.Types.ObjectId
  slug: string
}

interface ICategoryModelDB extends ICategoryModel, Document {}
const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    slug: { type: String },
  },
  { timestamps: true }
)

export const CategoryModel = mongoose.model<ICategoryModelDB>(
  "Category",
  categorySchema
)
