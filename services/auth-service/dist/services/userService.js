"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.updateUserRole = exports.createUser = exports.findUserByEmail = void 0;
const client_1 = require("../prisma/client");
const findUserByEmail = (email) => client_1.prisma.user.findUnique({ where: { email } });
exports.findUserByEmail = findUserByEmail;
// Création d'un utilisateur
const createUser = (email, username, password) => client_1.prisma.user.create({
    data: { email, username, password },
});
exports.createUser = createUser;
// Mise à jour du rôle d'un utilisateur
const updateUserRole = (id, role) => client_1.prisma.user.update({
    where: { id },
    data: { role },
});
exports.updateUserRole = updateUserRole;
// Récupération de tous les utilisateurs
const getAllUsers = () => client_1.prisma.user.findMany();
exports.getAllUsers = getAllUsers;
