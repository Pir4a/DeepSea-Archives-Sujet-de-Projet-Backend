"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
//Crétation de la route POST register pour se register
router.post("/register", authController_1.register);
//Crétation de la route POST login pour se login
router.post("/login", authController_1.login);
//Crétation de la route me pour récupérer ses propre infos après login
router.get("/me", authMiddleware_1.authRequired, authController_1.me);
exports.default = router;
