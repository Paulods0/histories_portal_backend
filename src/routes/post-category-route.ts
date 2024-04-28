import { Router } from "express"
import {
  createPostCategory,
  deletePostCategory,
  getAllPostCategories,
  getSinglePostCategory,
  updatePostCategory,
} from "../controllers/post-category-controller"

const route = Router()

route.post("/", createPostCategory)
route.get("/", getAllPostCategories)
route.get("/:id", getSinglePostCategory)
route.put("/:id", updatePostCategory)
route.delete("/:id", deletePostCategory)

export = route
