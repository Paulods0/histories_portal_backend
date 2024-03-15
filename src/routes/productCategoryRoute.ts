import { Router } from "express"

const route = Router()

route.post("/")
route.get("/prod-categories")
route.get("/prod-category/:id")
route.put("/prod-category/:id")
route.delete("/prod-category/:id")

export = route
