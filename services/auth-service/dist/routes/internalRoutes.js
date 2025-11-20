"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const internalController_1 = require("../controllers/internalController");
const router = (0, express_1.Router)();
// Route for internal service communication (secured by IP or shared secret in production)
// POST /internal/reputation
router.post("/reputation", internalController_1.updateReputation);
exports.default = router;
