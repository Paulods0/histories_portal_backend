import { Router } from "express"
import { ProductController } from "../controllers/product-controller"

const route = Router()

route.post("/", ProductController.createProduct)
route.get("/", ProductController.getAllProducts)
route.put("/:id", ProductController.updateProduct)
route.get("/:id", ProductController.getProductById)
route.delete("/:id", ProductController.deleteProduct)

export = route
