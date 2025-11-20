"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signPayload = signPayload;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("./AppError"));
function getSecret() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment');
    }
    return process.env.JWT_SECRET;
}
function signPayload(payload, options = {}) {
    const secret = getSecret();
    const defaultOptions = { expiresIn: '1h' };
    return jsonwebtoken_1.default.sign(payload, secret, { ...defaultOptions, ...options });
}
function verifyToken(token) {
    try {
        const secret = getSecret();
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch {
        throw new AppError_1.default('Invalid or expired token', 401);
    }
}
