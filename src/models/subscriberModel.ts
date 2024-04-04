import mongoose from "mongoose"

const SubscriberSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
})

export const SubscriberModel = mongoose.model("Subscriber", SubscriberSchema)
