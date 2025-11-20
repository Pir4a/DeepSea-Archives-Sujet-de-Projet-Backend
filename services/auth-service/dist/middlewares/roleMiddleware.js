"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
// Vérification du rôle
const requireRole = (role) => {
    // Vérification de l'authentification
    if (!role)
        return (req, res, next) => {
            if (!req.user)
                return res.status(401).json({ error: "Unauthorized" });
            next();
        };
    return (req, res, next) => {
        // Vérification de l'authentification
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        // Vérification du rôle
        if (req.user?.role !== role)
            return res.status(403).json({ error: "Forbidden" });
        // Si tout est bon, on passe à la suite
        next();
    };
};
exports.requireRole = requireRole;
