import { Router } from "express"
import {
  createPartner,
  deletePartner,
  getAllPartners,
  getSinglePartner,
  updatePartner,
} from "../controllers/partner-controller"

const route = Router()

route.post("/", createPartner)
route.get("/", getAllPartners)
route.get("/:id", getSinglePartner)
route.put("/:id", updatePartner)
route.delete("/:id", deletePartner)

export = route
