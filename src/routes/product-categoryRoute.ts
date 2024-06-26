import { Router } from "express"
import {
  createProductCategory,
  getAllProductCategories,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
} from "../controllers/product-category-controller"

const route = Router()

route.post("/", createProductCategory)
route.get("/", getAllProductCategories)
route.get("/:id", getProductCategoryById)
route.put("/:id", updateProductCategory)
route.delete("/:id", deleteProductCategory)

export = route
