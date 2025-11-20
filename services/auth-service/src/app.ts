import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
dotenv.config()

// Import des routes
import authRoutes from "./routes/authRoutes"
import adminRoutes from "./routes/adminRoutes"

const app = express()

app.use(cors())
app.use(express.json())


const swaggerDoc = YAML.load(__dirname + "/swagger/auth.yaml")

// Route /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))

// Route /auth
app.use("/auth", authRoutes)

// Route /admin
app.use("/admin", adminRoutes)

export default app