import { Router } from "express"
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/categoryController"

const route = Router()

route.post("/new", createCategory)
route.get("/all", getAllCategories)
route.get("/:id", getSingleCategory)
route.delete("/:id", deleteCategory)
route.put("/:id", updateCategory)

export = route
