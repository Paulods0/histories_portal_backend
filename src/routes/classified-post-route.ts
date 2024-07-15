import { Router } from "express"
import { ClassifiedPostController } from "../controllers/classified-post-controller"

const route = Router()

route.post("/", ClassifiedPostController.createClassifiedsPost)
route.get("/", ClassifiedPostController.getAllClassifiedPost)
route.get("/:id", ClassifiedPostController.getSinlgeClassifiedPost)
route.put("/:id", ClassifiedPostController.updateClassifiedPost)
route.delete("/:id", ClassifiedPostController.deleteClassifiedPost)

export = route
