import { Request, Response } from "express"
import { updateUserRole, getAllUsers } from "../services/userService"

// Récupération de tous les utilisateurs
export const adminGetUsers = async (_req: Request, res: Response) => {
  try {
    // Récupération de tous les utilisateurs
    const users = await getAllUsers()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Mise à jour du rôle d'un utilisateur
export const adminUpdateRole = async (req: Request, res: Response) => {
  try {
    // Récupération de l'id et du rôle
    const id = Number(req.params.id)
    const { role } = req.body

    // Vérification du rôle
    if (!["USER", "EXPERT", "ADMIN"].includes(role))
      return res.status(400).json({ error: "Invalid role" })

    // Mise à jour du rôle
    const user = await updateUserRole(id, role)
    
    // Retour de l'utilisateur mis à jour
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
}
