import { Router } from "express"
import {
  createProductCategory,
  getAllProductCategories,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
} from "../controllers/productCategoryController"

const route = Router()

route.post("/", createProductCategory)
route.get("/prod-categories", getAllProductCategories)
route.get("/prod-category/:id", getProductCategoryById)
route.put("/prod-category/:id", updateProductCategory)
route.delete("/prod-category/:id", deleteProductCategory)

export = route
