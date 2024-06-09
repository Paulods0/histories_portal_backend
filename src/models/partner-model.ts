import mongoose, { Types } from "mongoose"

const PartnerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Types.ObjectId, ref: "User", required: true },
})

export const PartnerModel = mongoose.model("Partner", PartnerSchema)
