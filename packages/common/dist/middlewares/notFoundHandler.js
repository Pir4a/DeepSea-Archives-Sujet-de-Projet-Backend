"use strict";
// Middleware 404 partagé
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = notFoundHandler;
function notFoundHandler(req, res) {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
}
