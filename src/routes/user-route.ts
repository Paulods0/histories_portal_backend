import { Router } from "express"
import { UserController } from "../controllers/user-controller"

const route = Router()

route.get("/", UserController.getUsers)
route.post("/", UserController.createUser)
route.put("/:id", UserController.updateUser)
route.post("/login", UserController.loginUser)
route.delete("/:id", UserController.deleteUser)
route.get("/:id", UserController.getSingleUser)
route.put("/forgetpassword", UserController.forgetPassword)

export = route
