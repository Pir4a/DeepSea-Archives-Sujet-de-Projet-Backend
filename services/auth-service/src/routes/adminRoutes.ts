import { Router } from "express"
import { adminGetUsers, adminUpdateRole } from "../controllers/adminController"
import { authRequired } from "../middlewares/authMiddleware"
import { requireRole } from "../middlewares/roleMiddleware"

const router = Router()

router.get("/users", authRequired, requireRole("ADMIN"), adminGetUsers)
router.patch("/users/:id/role", authRequired, requireRole("ADMIN"), adminUpdateRole)

export default router
