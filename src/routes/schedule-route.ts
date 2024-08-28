import { Router } from "express"
import { ScheduleController } from "../controllers/schedule-controller/schedule-controller"

const route = Router()

route.post("/", ScheduleController.createSchedulePost)
route.get("/", ScheduleController.getAllSchedulePosts)
route.get("/:id", ScheduleController.getSingleSchedulePost)
route.put("/:id", ScheduleController.updateSchedulePost)
route.delete("/:id", ScheduleController.deleteSchedulePost)

export = route
