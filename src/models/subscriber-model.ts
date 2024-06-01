import mongoose from "mongoose"

const SubscriberSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String },
  country: { type: String, deafult: "Angola" },
  countryCode: { type: String, default: "+244" },
})

export const SubscriberModel = mongoose.model("Subscriber", SubscriberSchema)
