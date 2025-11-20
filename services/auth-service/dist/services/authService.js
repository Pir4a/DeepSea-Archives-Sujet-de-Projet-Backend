"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const userService_1 = require("./userService");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
//Création d'un utilisateur
const registerUser = async (email, username, password) => {
    //Vérification de l'email
    const existing = await (0, userService_1.findUserByEmail)(email);
    if (existing)
        throw new Error("Email already exists");
    const hashed = await (0, hash_1.hashPassword)(password);
    return (0, userService_1.createUser)(email, username, hashed);
};
exports.registerUser = registerUser;
//Authentification d'un utilisateur
const loginUser = async (email, password) => {
    // Recherche de l'utilisateur
    const user = await (0, userService_1.findUserByEmail)(email);
    if (!user)
        throw new Error("Invalid credentials");
    // Comparaison du mot de passe
    const ok = await (0, hash_1.comparePassword)(password, user.password);
    if (!ok)
        throw new Error("Invalid credentials");
    // Création d'un token
    const token = (0, jwt_1.signToken)({ id: user.id, role: user.role });
    return { user, token };
};
exports.loginUser = loginUser;
