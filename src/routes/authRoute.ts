import { Router } from "express"
import {
  createUser,
  deleteUser,
  getSingleUser,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/authController"
import { checkValidation } from "../middlewares/checkValidation"

const route = Router()

route.post("/login", loginUser)
route.post("/", createUser)
route.get("/", getUsers)
route.get("/:id", getSingleUser)
route.patch("/:id", updateUser)
route.delete("/:id", deleteUser)

export = route
