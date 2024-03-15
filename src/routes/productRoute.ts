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
route.get("/", getAllProducts)
route.get("/", getProductById)
route.put("/", updateProduct)
route.delete("/", deleteProduct)

export = route
