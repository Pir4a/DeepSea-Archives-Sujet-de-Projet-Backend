import { Router } from "express";
import { updateReputation } from "../controllers/internalController";

const router = Router();

// Route for internal service communication (secured by IP or shared secret in production)
// POST /internal/reputation
router.post("/reputation", updateReputation);

export default router;

