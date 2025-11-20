"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
const jwt_1 = require("../lib/jwt");
const AppError_1 = __importDefault(require("../lib/AppError"));
/**
 * Middleware d'authentification générique.
 * - Lit le header Authorization: Bearer <token>
 * - Vérifie le JWT
 * - Place le payload dans req.user
 * - Optionnel: valide le token auprès du service d'auth
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');
    // Exempt swagger docs from auth
    if (req.path.startsWith('/api-docs')) {
        return next();
    }
    if (scheme !== 'Bearer' || !token) {
        return next(new AppError_1.default('Authentication required', 401));
    }
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        // Note: Ideally we would validate against auth service here if token revocation is needed
        // but for performance we trust the JWT signature + expiration for basic auth.
        // Role checks might need fresher data depending on policy.
        return next();
    }
    catch (err) {
        return next(err);
    }
}
/**
 * Middleware de vérification de rôle (USER, EXPERT, ADMIN, etc.)
 * Exemple d'utilisation: app.get('/admin', authMiddleware, requireRole('ADMIN'), handler)
 */
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError_1.default('Authentication required', 401));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError_1.default('Forbidden', 403));
        }
        return next();
    };
}
