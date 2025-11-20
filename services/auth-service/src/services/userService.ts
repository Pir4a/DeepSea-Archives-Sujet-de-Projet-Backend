import { prisma } from "../prisma/client"
import { Role } from "@prisma/client"

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } })

// Création d'un utilisateur
export const createUser = (email: string, username: string, password: string) =>
  prisma.user.create({
    data: { email, username, password },
  })

// Mise à jour du rôle d'un utilisateur
export const updateUserRole = (id: number, role: Role) =>
  prisma.user.update({
    where: { id },
    data: { role },
  })

// Récupération de tous les utilisateurs
export const getAllUsers = () =>
  prisma.user.findMany()
