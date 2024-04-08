import { Router } from "express"
import {
  createPost,
  deletePost,
  deslikePost,
  getAllPosts,
  getAllPostsByCategory,
  getAllPostsPagination,
  getHighlightedPost,
  getMostViewedPosts,
  getSearchedPosts,
  getSinglePost,
  getUserPosts,
  likePost,
  updatePost,
} from "../controllers/postController"

const route = Router()

route.post("/create-post", createPost)
route.put("/like/:postId", likePost)
route.put("/deslike/:postId", deslikePost)
route.get("/get", getAllPosts)
route.get("/posts/page/:page", getAllPostsPagination)
route.get("/category/:category", getAllPostsByCategory)
route.get("/highlighted", getHighlightedPost)
route.get("/search", getSearchedPosts)
route.get("/get/:id", getSinglePost)
route.get("/get/userposts/:user_id", getUserPosts)
route.get("/mostviewed", getMostViewedPosts)
route.delete("/delete/:id", deletePost)
route.put("/:id", updatePost)

export = route
