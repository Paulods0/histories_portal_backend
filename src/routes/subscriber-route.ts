import { Router } from "express"
import { SubscriberController } from "../controllers/subscriber-controller"

const router = Router()

router.put("/:id", SubscriberController.updateSub)
router.get("/", SubscriberController.getAllSubscribers)
router.post("/register", SubscriberController.registerSubscriber)
router.put("/unregister", SubscriberController.unregisterSubscriber)
router.delete("/:id", SubscriberController.deleteSub)

export = router
