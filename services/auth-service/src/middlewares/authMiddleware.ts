import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  user?: any
}

// Vérification du token
export const authRequired = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Vérification de l'authentification
    const header = req.headers.authorization
    if (!header) return res.status(401).json({ error: "Missing token" })

    // Vérification du format du token
    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Token format must be 'Bearer <token>'" });
    }

    // Extraction du token
    const token = parts[1];

    // Vérification du token
    const data = jwt.verify(token, process.env.JWT_SECRET as string)

    req.user = data
    next()
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
}
