"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.details = details;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Error.captureStackTrace?.(this, this.constructor);
    }
}
exports.default = AppError;
