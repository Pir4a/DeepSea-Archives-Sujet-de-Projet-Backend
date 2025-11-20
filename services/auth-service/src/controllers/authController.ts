import { Request, Response } from "express"
import { registerUser, loginUser } from "../services/authService"
import { prisma } from "../prisma/client"

export const register = async (req: Request, res: Response) => {
  try {
    // Récupération des données de l'utilisateur
    const { email, username, password } = req.body

    // Verification des données
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Missing fields" })
    }
    
    // Création de l'utilisateur
    const user = await registerUser(email, username, password)
    return res.json(user)
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
}

// Authentification d'un utilisateur
export const login = async (req: Request, res: Response) => {
  try {
    // Récupération des données de l'utilisateur
    const { email, password } = req.body
    
    //Verification des données
    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" })
    }

    //Authentification de l'utilisateur
    const result = await loginUser(email, password)
    return res.json(result)
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
}

// Récupération des données de l'utilisateur
export const me = async (req: any, res: Response) => {
  try {
    // Vérification de l'authentification
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    
    // Récupération des données de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })
    
    // Retour des données de l'utilisateur
    return res.json(user)
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
}
