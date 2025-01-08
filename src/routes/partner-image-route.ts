import { Router } from "express"
import { PartnerImageController } from "../controllers/partner-image-controller/partner-image-controller"

const router = Router()

router.post("/", PartnerImageController.create)
router.get("/", PartnerImageController.getAll)
router.put("/:id", PartnerImageController.update)
router.delete("/:id", PartnerImageController.delete)

export = router
