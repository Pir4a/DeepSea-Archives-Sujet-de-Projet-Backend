import bcrypt from "bcrypt"

//Hashage du mot de passe avec bcrypt
export const hashPassword = (plain: string) => bcrypt.hash(plain, 10)

//Comparaison du hash avec bcrypt
export const comparePassword = (plain: string, hashed: string) =>
  bcrypt.compare(plain, hashed)