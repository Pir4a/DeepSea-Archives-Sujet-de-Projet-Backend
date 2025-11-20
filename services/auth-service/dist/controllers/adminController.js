"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateRole = exports.adminGetUsers = void 0;
const userService_1 = require("../services/userService");
// Récupération de tous les utilisateurs
const adminGetUsers = async (_req, res) => {
    try {
        // Récupération de tous les utilisateurs
        const users = await (0, userService_1.getAllUsers)();
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.adminGetUsers = adminGetUsers;
// Mise à jour du rôle d'un utilisateur
const adminUpdateRole = async (req, res) => {
    try {
        // Récupération de l'id et du rôle
        const id = Number(req.params.id);
        const { role } = req.body;
        // Vérification du rôle
        if (!["USER", "EXPERT", "ADMIN"].includes(role))
            return res.status(400).json({ error: "Invalid role" });
        // Mise à jour du rôle
        const user = await (0, userService_1.updateUserRole)(id, role);
        // Retour de l'utilisateur mis à jour
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.adminUpdateRole = adminUpdateRole;
