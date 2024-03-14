import { Router } from "express"
import {
  createPost,
  deletePost,
  getAllPosts,
  getAllPostsByCategory,
  getAllPostsPagination,
  getHighlightedPost,
  getHighlightedPosts,
  getSinglePost,
  updatePost,
} from "../controllers/postController"

const route = Router()

route.post("/create-post", createPost)
route.get("/get", getAllPosts)
route.get("/posts", getAllPostsPagination)
route.get("/", getAllPostsByCategory)
route.get("/posts", getHighlightedPosts)
route.get("/get/:id", getSinglePost)
route.delete("/:id", deletePost)
route.put("/:id", updatePost)

export = route
