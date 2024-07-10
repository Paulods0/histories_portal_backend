import { Router } from "express"
import { Partner } from "../controllers/partner-controller"

const route = Router()

route.post("/", Partner.createPartner)
route.get("/", Partner.getAllPartners)
route.get("/:id", Partner.getSinglePartner)
route.put("/:id", Partner.updatePartner)
route.delete("/:id", Partner.deletePartner)

export = route
