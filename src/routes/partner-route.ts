import { Router } from "express"
import { PartnerController } from "../controllers/partner-controller"

const route = Router()

route.post("/", PartnerController.createPartner)
route.get("/", PartnerController.getAllPartners)
route.get("/:id", PartnerController.getSinglePartner)
route.put("/:id", PartnerController.updatePartner)
route.delete("/:id", PartnerController.deletePartner)

export = route
