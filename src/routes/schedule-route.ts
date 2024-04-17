import { Router } from "express"
import { createSchedulePost, deleteSchedulePost, getAllSchedulePosts, getSingleSchedulePost, updateSchedulePost } from "../controllers/schedule-controller"

const route = Router()

route.post("/", createSchedulePost)
route.get("/", getAllSchedulePosts)
route.get("/:id", getSingleSchedulePost)
route.put("/:id", updateSchedulePost)
route.delete("/:id", deleteSchedulePost)

export = route
