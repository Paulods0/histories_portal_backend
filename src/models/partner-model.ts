import mongoose, { Types } from "mongoose"

const PartnerSchema = new mongoose.Schema({
  tags: [{ type: String }],
  author_notes: { type: String },
  date: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Types.ObjectId, ref: "User", required: true },
})

export const PartnerModel = mongoose.model("Partner", PartnerSchema)
