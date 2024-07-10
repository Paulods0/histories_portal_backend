import { Router } from "express"
import { User } from "../controllers/user-controller"

const route = Router()

route.get("/", User.getUsers)
route.post("/", User.createUser)
route.put("/:id", User.updateUser)
route.post("/login", User.loginUser)
route.delete("/:id", User.deleteUser)
route.get("/:id", User.getSingleUser)
route.put("/forgetpassword", User.forgetPassword)

export = route
