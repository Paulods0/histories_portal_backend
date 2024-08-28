import { Router } from "express"
import { PostController } from "../controllers/post-controller/post-controller"

const route = Router()

route.post("/", PostController.createPost)
route.get("/", PostController.getAllPosts)
route.put("/:id", PostController.updatePost)
route.put("/like/:id", PostController.likePost)
route.get("/:id", PostController.getSinglePost)
route.delete("/:id", PostController.deletePost)
route.get("/search", PostController.getSearchedPosts)
route.put("/deslike/:id", PostController.deslikePost)
route.get("/user-posts/:user_id", PostController.getUserPosts)
route.get("/get/most-liked", PostController.getMostLikedPosts)
route.get("/get/most-views-post", PostController.getMostViewedPosts)
route.get("/get/highlighted-post", PostController.getHighlightedPost)

export = route
