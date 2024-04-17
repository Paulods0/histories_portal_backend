import { Router } from "express"
import {
  createUser,
  deleteUser,
  forgetPassword,
  getSingleUser,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/user-controller"
import { checkValidation } from "../middlewares/checkValidation"

const route = Router()

route.post("/login", loginUser)
route.post("/", createUser)
route.put("/forgetpassword", forgetPassword)
route.get("/", getUsers)
route.get("/:id", getSingleUser)
route.patch("/:id", updateUser)
route.delete("/:id", deleteUser)

export = route
