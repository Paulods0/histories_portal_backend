import { Router } from "express"
import { ClassifiedPost } from "../controllers/classified-post-controller"

const route = Router()

route.post("/", ClassifiedPost.createClassifiedsPost)
route.get("/", ClassifiedPost.getAllClassifiedPost)
route.get("/:id", ClassifiedPost.getSinlgeClassifiedPost)
route.put("/:id", ClassifiedPost.updateClassifiedPost)
route.delete("/:id", ClassifiedPost.deleteClassifiedPost)

export = route
