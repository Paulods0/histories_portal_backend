import { Router } from "express"
import { Tip } from "../controllers/tips-controller"

const route = Router()

route.post("/", Tip.createTip)
route.get("/", Tip.getTips)
route.get("/:id", Tip.getSingleTip)
route.put("/:id", Tip.updateTip)
route.delete("/:id", Tip.deleteTip)

export = route
