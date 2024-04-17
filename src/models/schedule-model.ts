import mongoose from "mongoose"

const ScheduleSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    file: { type: String, required: true },
  },
  { timestamps: true }
)

export const ScheduleModel = mongoose.model("Schedule", ScheduleSchema)
