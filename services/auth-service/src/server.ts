import app from "./app"
import { prisma } from "./prisma/client"

//Definition du port du service
const PORT = process.env.PORT || 3001

async function start() {
  try {
    // Check if DATABASE_URL is set
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      console.error("DATABASE_URL is not set!")
    } else {
      // Log masked URL for debugging
      console.log(`Using DATABASE_URL: ${dbUrl.replace(/:[^:@]*@/, ":****@")}`)
    }

    // Attempt to connect to the database
    console.log("Connecting to database...")
    await prisma.$connect()
    console.log("Database connection established")

    //Lancement de l'écoute du service sur le port défini
    app.listen(PORT, () => {
      console.log(`Auth service running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start auth service:", error)
    process.exit(1)
  }
}

start()
