import mongoose,{ Schema  } from "mongoose";

const SendEmailSchema = new Schema({
  canSendEmail: {type:Boolean, default:false}
})

export const SendEmailModel = mongoose.model("sendEmail", SendEmailSchema)