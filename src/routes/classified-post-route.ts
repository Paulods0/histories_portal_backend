import { Router } from "express"
import {
  createClassifiedsPost,
  deleteClassifiedPost,
  getAllClassifiedPost,
  getSinlgeClassifiedPost,
  updateClassifiedPost,
} from "../controllers/classified-post-controller"

const route = Router()

route.post("/", createClassifiedsPost)
route.get("/", getAllClassifiedPost)
route.get("/:id", getSinlgeClassifiedPost)
route.put("/:id", updateClassifiedPost)
route.delete("/:id", deleteClassifiedPost)

export = route
