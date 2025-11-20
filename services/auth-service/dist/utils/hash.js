"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
//Hashage du mot de passe avec bcrypt
const hashPassword = (plain) => bcrypt_1.default.hash(plain, 10);
exports.hashPassword = hashPassword;
//Comparaison du hash avec bcrypt
const comparePassword = (plain, hashed) => bcrypt_1.default.compare(plain, hashed);
exports.comparePassword = comparePassword;
