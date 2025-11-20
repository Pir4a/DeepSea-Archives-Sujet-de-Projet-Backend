import { findUserByEmail, createUser } from "./userService"
import { hashPassword, comparePassword } from "../utils/hash"
import { signToken } from "../utils/jwt"

//Création d'un utilisateur
export const registerUser = async (email: string, username: string, password: string) => {
  //Vérification de l'email
  const existing = await findUserByEmail(email)
  if (existing) throw new Error("Email already exists")

  const hashed = await hashPassword(password)
  return createUser(email, username, hashed)
}

//Authentification d'un utilisateur
export const loginUser = async (email: string, password: string) => {
  // Recherche de l'utilisateur
  const user = await findUserByEmail(email)
  if (!user) throw new Error("Invalid credentials")

  // Comparaison du mot de passe
  const ok = await comparePassword(password, user.password)
  if (!ok) throw new Error("Invalid credentials")

  // Création d'un token
  const token = signToken({ id: user.id, role: user.role })
  return { user, token }
}
