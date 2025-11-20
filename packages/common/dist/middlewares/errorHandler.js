"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const AppError_1 = __importDefault(require("../lib/AppError"));
const logger_1 = __importDefault(require("../lib/logger"));
// Middleware d’erreur Express partagé
// À placer en dernier dans chaque microservice
function errorHandler(err, req, res, next) {
    if (!err)
        return next();
    const isAppError = err instanceof AppError_1.default;
    const statusCode = isAppError ? err.statusCode : 500;
    logger_1.default.error('request_error', {
        statusCode,
        path: req.path,
        method: req.method,
        message: err.message,
    });
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(isAppError && err.details ? { details: err.details } : {}),
    });
}
