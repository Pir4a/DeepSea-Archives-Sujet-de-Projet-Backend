"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequired = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Vérification du token
const authRequired = (req, res, next) => {
    try {
        // Vérification de l'authentification
        const header = req.headers.authorization;
        if (!header)
            return res.status(401).json({ error: "Missing token" });
        // Vérification du format du token
        const parts = header.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ error: "Token format must be 'Bearer <token>'" });
        }
        // Extraction du token
        const token = parts[1];
        // Vérification du token
        const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};
exports.authRequired = authRequired;
