import { Router } from "express"
import {
  registerSubscriber,
  unregisterSubscriber,
  sendEmail,
  getAllSubscribers,
} from "../controllers/subscriber-controller"

const router = Router()

router.post("/register", registerSubscriber)
router.post("/send/mail", sendEmail)
router.get("/", getAllSubscribers)
router.delete("/unregister/:id", unregisterSubscriber)

export = router
