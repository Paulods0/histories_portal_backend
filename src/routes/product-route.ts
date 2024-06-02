import { Request, Response, Router } from "express"
import {
  buyProduct,
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
} from "../controllers/product-controller"
import { EmailProps, mailSend } from "../helpers"

const route = Router()

route.post("/", createProduct)
route.get("/", getAllProducts)
route.put("/:id", updateProduct)
route.get("/:id", getProductById)
route.delete("/:id", deleteProduct)
route.get("/product-cat", getProductsByCategory)
route.post("/buy-product", buyProduct)


export = route
