import { Router } from "express"
import { TipController } from "../controllers/tips-controller"

const route = Router()

route.post("/", TipController.createTip)
route.get("/", TipController.getTips)
route.get("/:id", TipController.getSingleTip)
route.put("/:id", TipController.updateTip)
route.delete("/:id", TipController.deleteTip)

export = route
