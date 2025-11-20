import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import path from "path"
dotenv.config()

// Import des routes
import authRoutes from "./routes/authRoutes"
import adminRoutes from "./routes/adminRoutes"
import internalRoutes from "./routes/internalRoutes"

const app = express()

app.use(cors())
app.use(express.json())

const swaggerPath = path.join(__dirname, "swagger", "auth.yaml")
const swaggerDoc = YAML.load(swaggerPath)

// Route /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))

// Route /auth
app.use("/auth", authRoutes)

// Route /admin
app.use("/admin", adminRoutes)

// Route /internal
app.use("/internal", internalRoutes)

export default app
