import { Router } from "express"
import { MailController } from "../controllers/mail-controller"

const router = Router()

router.post("/buy-product", MailController.buyProduct)
router.post("/write-for-us", MailController.sendWriteForUsMail)
router.post("/want-to-be-yours", MailController.sendWantToBeYoursMail)

export = router
