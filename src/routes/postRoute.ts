import { Router } from "express"
import {
  createPost,
  deletePost,
  getAllPosts,
  getAllPostsByCategory,
  getAllPostsPagination,
  getHighlightedPost,
  getHighlightedPosts,
  getMostViewedPosts,
  getSinglePost,
  getUserPosts,
  updatePost,
} from "../controllers/postController"

const route = Router()

route.post("/create-post", createPost)
route.get("/get", getAllPosts)
route.get("/posts", getAllPostsPagination)
route.get("/category/:category", getAllPostsByCategory)
route.get("/posts/highlighted", getHighlightedPosts)
route.get("/get/:id", getSinglePost)
route.get("/get/userposts/:user_id", getUserPosts)
route.get("/mostviewed", getMostViewedPosts)
route.delete("/delete/:id", deletePost)
route.put("/:id", updatePost)

export = route
