import mongoose from "mongoose"

interface PartnerImageDocument extends mongoose.Document {
  image: string
  createdAt: Date
}

const PartnerImageSchema = new mongoose.Schema<PartnerImageDocument>(
  {
    image: { type: String, required: true },
  },
  { timestamps: true }
)

const PartnerImageModel = mongoose.model<PartnerImageDocument>(
  "partner-image",
  PartnerImageSchema
)

export default PartnerImageModel
