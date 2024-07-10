import { Router } from "express"
import { Schedule } from "../controllers/schedule-controller"

const route = Router()

route.post("/", Schedule.createSchedulePost)
route.get("/", Schedule.getAllSchedulePosts)
route.get("/:id", Schedule.getSingleSchedulePost)
route.put("/:id", Schedule.updateSchedulePost)
route.delete("/:id", Schedule.deleteSchedulePost)

export = route
