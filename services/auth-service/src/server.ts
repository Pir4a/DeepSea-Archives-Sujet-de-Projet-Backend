import app from "./app"

//Definition du port du service
const PORT = process.env.PORT || 3001

//Lancement de l'écoute du service sur le port défini
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`)
})