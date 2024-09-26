import { Router } from "express"
import { MailController } from "../controllers/mail-controller"
import { SendEmailController } from "../controllers/send-email-controller/send-email"

const router = Router()

router.post("/buy-product", MailController.buyProduct)
router.post("/write-for-us", MailController.sendWriteForUsMail)
router.post("/want-to-be-yours", MailController.sendWantToBeYoursMail)

router.get("/email-status", SendEmailController.getStatus)
router.patch("/email-status", SendEmailController.updateSendEmail)

export = router
