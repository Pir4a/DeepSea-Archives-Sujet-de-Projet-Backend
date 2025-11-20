"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const client_1 = require("../prisma/client");
const register = async (req, res) => {
    try {
        // Récupération des données de l'utilisateur
        const { email, username, password } = req.body;
        // Verification des données
        if (!email || !username || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }
        // Création de l'utilisateur
        const user = await (0, authService_1.registerUser)(email, username, password);
        return res.json(user);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.register = register;
// Authentification d'un utilisateur
const login = async (req, res) => {
    try {
        // Récupération des données de l'utilisateur
        const { email, password } = req.body;
        //Verification des données
        if (!email || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }
        //Authentification de l'utilisateur
        const result = await (0, authService_1.loginUser)(email, password);
        return res.json(result);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.login = login;
// Récupération des données de l'utilisateur
const me = async (req, res) => {
    try {
        // Vérification de l'authentification
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // Récupération des données de l'utilisateur
        const user = await client_1.prisma.user.findUnique({
            where: { id: req.user.id },
        });
        // Retour des données de l'utilisateur
        return res.json(user);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.me = me;
