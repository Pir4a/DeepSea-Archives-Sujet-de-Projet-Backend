import { Router } from "express"
import { register, login, me } from "../controllers/authController"
import { authRequired } from "../middlewares/authMiddleware"

const router = Router()

//Crétation de la route POST register pour se register
router.post("/register", register)

//Crétation de la route POST login pour se login
router.post("/login", login)

//Crétation de la route me pour récupérer ses propre infos après login
router.get("/me", authRequired, me)

export default router
