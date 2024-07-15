import { Router } from "express"
import { SubscriberController } from "../controllers/subscriber-controller"

const router = Router()

router.get("/", SubscriberController.getAllSubscribers)
router.post("/register", SubscriberController.registerSubscriber)
router.put("/unregister", SubscriberController.unregisterSubscriber)

export = router