import { Router } from "express"
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
} from "../controllers/product-controller"

const route = Router()

route.post("/", createProduct)
route.get("/products", getAllProducts)
route.get("/product-cat", getProductsByCategory)
route.get("/:id", getProductById)
route.put("/:id", updateProduct)
route.delete("/:id", deleteProduct)

export = route
