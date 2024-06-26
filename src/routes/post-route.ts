import { Router } from "express"
import {
  likePost,
  createPost,
  updatePost,
  deletePost,
  deslikePost,
  getAllPosts,
  getUserPosts,
  getByCategory,
  getSinglePost,
  getSearchedPosts,
  getMostLikedPosts,
  getMostViewedPosts,
  getHighlightedPost,
} from "../controllers/post-controller"

const route = Router()

route.post("/", createPost)
route.get("/", getAllPosts)
route.put("/:id", updatePost)
route.put("/like/:id", likePost)
route.get("/:id", getSinglePost)
route.delete("/:id", deletePost)
route.get("/search", getSearchedPosts)
route.put("/deslike/:id", deslikePost)
route.get("/user-posts/:user_id", getUserPosts)
route.get("/get/most-liked", getMostLikedPosts)
route.get("/category/:category_slug", getByCategory)
route.get("/get/most-views-post", getMostViewedPosts)
route.get("/get/highlighted-post", getHighlightedPost)

export = route
