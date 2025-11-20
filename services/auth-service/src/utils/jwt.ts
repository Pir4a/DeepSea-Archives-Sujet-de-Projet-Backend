import jwt from "jsonwebtoken"

// Création d'un token
export const signToken = (payload: object) => {
  // Récupération de la clé secrète
  const secret = process.env.JWT_SECRET!

  // Récupération de la durée de validité
  const expiresIn: jwt.SignOptions["expiresIn"] =
    (process.env.TOKEN_EXPIRES as any) ?? "2h"

  // Création du token
  return jwt.sign(payload, secret, { expiresIn })
}