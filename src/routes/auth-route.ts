import { Router } from "express"
import {
  createUser,
  deleteUser,
  forgetPassword,
  getSingleUser,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/auth-controller"

const route = Router()

route.get("/", getUsers)
route.post("/", createUser)
route.put("/:id", updateUser)
route.post("/login", loginUser)
route.delete("/:id", deleteUser)
route.get("/:id", getSingleUser)
route.put("/forgetpassword", forgetPassword)

export = route
