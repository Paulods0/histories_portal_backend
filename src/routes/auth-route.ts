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

route.post("/login", loginUser)
route.post("/", createUser)
route.put("/forgetpassword", forgetPassword)
route.get("/", getUsers)
route.get("/:id", getSingleUser)
route.put("/:id", updateUser)
route.delete("/:id", deleteUser)

export = route
