import { Router } from "express"
import {
  createTip,
  deleteTip,
  getSingleTip,
  getTips,
  updateTip,
} from "../controllers/tips-controller"

const route = Router()

route.post("/", createTip)
route.get("/", getTips)
route.get("/:id", getSingleTip)
route.put("/:id", updateTip)
route.delete("/:id", deleteTip)

export = route
