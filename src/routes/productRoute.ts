import { Router } from "express"
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController"

const route = Router()

route.post("/", createProduct)
route.get("/products", getAllProducts)
route.get("/:id", getProductById)
route.put("/:id", updateProduct)
route.delete("/:id", deleteProduct)

export = route
