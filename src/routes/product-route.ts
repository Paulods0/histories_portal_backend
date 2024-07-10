import { Router } from "express"
import { Product } from "../controllers/product-controller"

const route = Router()

route.post("/", Product.createProduct)
route.get("/", Product.getAllProducts)
route.put("/:id", Product.updateProduct)
route.get("/:id", Product.getProductById)
route.delete("/:id", Product.deleteProduct)
route.get("/product-cat", Product.getProductsByCategory)
route.post("/buy-product", Product.buyProduct)

export = route
