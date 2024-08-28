import { Router } from "express"
import { PartnerController } from "../controllers/partner-controller/partner-controller"

const route = Router()

route.post("/", PartnerController.createPartner)
route.get("/", PartnerController.getAllPartners)
route.put("/:id", PartnerController.updatePartner)
route.get("/:id", PartnerController.getSinglePartner)
route.delete("/:id", PartnerController.deletePartner)

export = route
