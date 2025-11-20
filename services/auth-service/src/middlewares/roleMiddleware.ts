import { AuthRequest } from "./authMiddleware"
import { Response, NextFunction } from "express"

// Vérification du rôle
export const requireRole = (role: string) => {
  // Vérification de l'authentification
  if (!role) return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })
    next()
  }
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Vérification de l'authentification
    if (!req.user) 
      return res.status(401).json({ error: "Unauthorized" })
    // Vérification du rôle
    if (req.user?.role !== role)
      return res.status(403).json({ error: "Forbidden" })
    // Si tout est bon, on passe à la suite
    next()
  }
}
