import { Router } from "express"
import {
  createPostCategory,
  deletePostCategory,
  getAllPostCategories,
  getSinglePostCategory,
  updatePostCategory,
} from "../controllers/post-category-controller"

const route = Router()

route.post("/new", createPostCategory)
route.get("/all", getAllPostCategories)
route.get("/:id", getSinglePostCategory)
route.delete("/:id", deletePostCategory)
route.put("/:id", updatePostCategory)

export = route
