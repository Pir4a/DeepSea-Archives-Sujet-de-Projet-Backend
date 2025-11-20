"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Création d'un token
const signToken = (payload) => {
    // Récupération de la clé secrète
    const secret = process.env.JWT_SECRET;
    // Récupération de la durée de validité
    const expiresIn = process.env.TOKEN_EXPIRES ?? "2h";
    // Création du token
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.signToken = signToken;
