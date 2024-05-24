import { Router } from "express"
import {
  registerSubscriber,
  unregisterSubscriber,
  // sendEmail,
  getAllSubscribers,
  sendMailToSubs,
} from "../controllers/subscriber-controller"

const router = Router()

router.post("/register", registerSubscriber)
router.post("/mail", sendMailToSubs)
router.get("/", getAllSubscribers)
router.delete("/unregister/:id", unregisterSubscriber)

export = router
